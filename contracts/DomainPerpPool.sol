// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DomainPerpPool
 * @dev Perpetual trading pool for domain name indices on Doma Protocol
 * @notice Implements perpetual swaps for the top 100 most traded domains
 */
contract DomainPerpPool is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    uint256 public constant MAX_LEVERAGE = 50;
    uint256 public constant MIN_LEVERAGE = 1;
    uint256 public constant FUNDING_RATE_PRECISION = 1e18;
    uint256 public constant PRICE_PRECISION = 1e18;
    uint256 public constant LIQUIDATION_THRESHOLD = 8000; // 80% in basis points
    uint256 public constant FUNDING_INTERVAL = 8 hours;
    
    // ============ State Variables ============
    IERC20 public immutable collateralToken; // USDC
    address public immutable priceOracle;
    address public immutable domainRegistry; // Doma Protocol registry
    
    struct Position {
        uint256 id;
        address user;
        uint256 size;
        bool isLong;
        uint256 leverage;
        uint256 entryPrice;
        uint256 margin;
        uint256 lastFundingTime;
        int256 unrealizedPnl;
        bool isActive;
    }
    
    struct PoolMetrics {
        uint256 totalValueLocked;
        uint256 totalOpenInterest;
        int256 currentFundingRate;
        uint256 lastFundingUpdate;
        uint256 totalPositions;
        uint256 totalVolume;
    }
    
    // ============ Storage ============
    mapping(uint256 => Position) public positions;
    mapping(address => uint256[]) public userPositions;
    mapping(address => uint256) public userMargin;
    mapping(address => uint256) public userLiquidity;
    
    PoolMetrics public poolMetrics;
    uint256 public nextPositionId = 1;
    uint256 public totalLiquidity;
    
    // Domain index tracking
    mapping(string => uint256) public domainPrices; // domain name => price
    string[] public trackedDomains;
    
    // ============ Events ============
    event PositionOpened(
        uint256 indexed positionId,
        address indexed user,
        uint256 size,
        bool isLong,
        uint256 leverage,
        uint256 entryPrice,
        uint256 margin
    );
    
    event PositionClosed(
        uint256 indexed positionId,
        address indexed user,
        uint256 exitPrice,
        int256 pnl,
        uint256 marginReturned
    );
    
    event LiquidityAdded(
        address indexed user,
        uint256 amount,
        uint256 totalLiquidity
    );
    
    event LiquidityRemoved(
        address indexed user,
        uint256 amount,
        uint256 totalLiquidity
    );
    
    event FundingRateUpdated(
        int256 newFundingRate,
        uint256 timestamp
    );
    
    event DomainPriceUpdated(
        string indexed domain,
        uint256 newPrice,
        uint256 timestamp
    );
    
    event PositionLiquidated(
        uint256 indexed positionId,
        address indexed user,
        uint256 liquidationPrice,
        uint256 liquidatedMargin
    );
    
    // ============ Modifiers ============
    modifier onlyOracle() {
        require(msg.sender == priceOracle, "Only oracle can call this");
        _;
    }
    
    modifier onlyActivePosition(uint256 positionId) {
        require(positions[positionId].isActive, "Position not active");
        _;
    }
    
    // ============ Constructor ============
    constructor(
        address _collateralToken,
        address _priceOracle,
        address _domainRegistry
    ) {
        collateralToken = IERC20(_collateralToken);
        priceOracle = _priceOracle;
        domainRegistry = _domainRegistry;
        
        // Initialize tracked domains (top 100 most traded)
        _initializeTrackedDomains();
    }
    
    // ============ Core Trading Functions ============
    
    /**
     * @dev Open a new perpetual position
     * @param size Position size in collateral tokens
     * @param isLong True for long position, false for short
     * @param leverage Leverage multiplier (1-50x)
     */
    function openPosition(
        uint256 size,
        bool isLong,
        uint256 leverage
    ) external nonReentrant whenNotPaused {
        require(leverage >= MIN_LEVERAGE && leverage <= MAX_LEVERAGE, "Invalid leverage");
        require(size > 0, "Size must be positive");
        
        uint256 margin = (size * PRICE_PRECISION) / leverage;
        uint256 currentPrice = getCurrentDomainIndexPrice();
        
        // Calculate required margin and fees
        uint256 requiredMargin = margin + _calculateTradingFees(size);
        
        // Transfer collateral from user
        collateralToken.safeTransferFrom(msg.sender, address(this), requiredMargin);
        
        // Create position
        uint256 positionId = nextPositionId++;
        positions[positionId] = Position({
            id: positionId,
            user: msg.sender,
            size: size,
            isLong: isLong,
            leverage: leverage,
            entryPrice: currentPrice,
            margin: margin,
            lastFundingTime: block.timestamp,
            unrealizedPnl: 0,
            isActive: true
        });
        
        userPositions[msg.sender].push(positionId);
        userMargin[msg.sender] += margin;
        
        // Update pool metrics
        poolMetrics.totalOpenInterest += size;
        poolMetrics.totalPositions++;
        poolMetrics.totalVolume += size;
        
        emit PositionOpened(positionId, msg.sender, size, isLong, leverage, currentPrice, margin);
    }
    
    /**
     * @dev Close an existing position
     * @param positionId ID of the position to close
     */
    function closePosition(uint256 positionId) external nonReentrant onlyActivePosition(positionId) {
        Position storage position = positions[positionId];
        require(position.user == msg.sender, "Not position owner");
        
        uint256 exitPrice = getCurrentDomainIndexPrice();
        int256 pnl = _calculatePnL(position, exitPrice);
        
        // Calculate final settlement
        uint256 marginReturned;
        if (pnl >= 0) {
            marginReturned = position.margin + uint256(pnl);
        } else {
            uint256 loss = uint256(-pnl);
            if (loss >= position.margin) {
                marginReturned = 0; // Total loss
            } else {
                marginReturned = position.margin - loss;
            }
        }
        
        // Update position
        position.isActive = false;
        position.unrealizedPnl = pnl;
        
        // Update user data
        userMargin[position.user] -= position.margin;
        _removeUserPosition(position.user, positionId);
        
        // Update pool metrics
        poolMetrics.totalOpenInterest -= position.size;
        poolMetrics.totalPositions--;
        
        // Transfer funds back to user
        if (marginReturned > 0) {
            collateralToken.safeTransfer(position.user, marginReturned);
        }
        
        emit PositionClosed(positionId, position.user, exitPrice, pnl, marginReturned);
    }
    
    // ============ Liquidity Functions ============
    
    /**
     * @dev Add liquidity to the pool
     * @param amount Amount of collateral tokens to add
     */
    function addLiquidity(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be positive");
        
        collateralToken.safeTransferFrom(msg.sender, address(this), amount);
        
        userLiquidity[msg.sender] += amount;
        totalLiquidity += amount;
        poolMetrics.totalValueLocked += amount;
        
        emit LiquidityAdded(msg.sender, amount, totalLiquidity);
    }
    
    /**
     * @dev Remove liquidity from the pool
     * @param amount Amount of collateral tokens to remove
     */
    function removeLiquidity(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(userLiquidity[msg.sender] >= amount, "Insufficient liquidity");
        require(totalLiquidity >= amount, "Insufficient pool liquidity");
        
        userLiquidity[msg.sender] -= amount;
        totalLiquidity -= amount;
        poolMetrics.totalValueLocked -= amount;
        
        collateralToken.safeTransfer(msg.sender, amount);
        
        emit LiquidityRemoved(msg.sender, amount, totalLiquidity);
    }
    
    // ============ Oracle Functions ============
    
    /**
     * @dev Update domain prices (only callable by oracle)
     * @param domains Array of domain names
     * @param prices Array of corresponding prices
     */
    function updateDomainPrices(
        string[] calldata domains,
        uint256[] calldata prices
    ) external onlyOracle {
        require(domains.length == prices.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < domains.length; i++) {
            domainPrices[domains[i]] = prices[i];
            emit DomainPriceUpdated(domains[i], prices[i], block.timestamp);
        }
    }
    
    /**
     * @dev Update funding rate
     * @param newFundingRate New funding rate (can be negative)
     */
    function updateFundingRate(int256 newFundingRate) external onlyOracle {
        poolMetrics.currentFundingRate = newFundingRate;
        poolMetrics.lastFundingUpdate = block.timestamp;
        
        emit FundingRateUpdated(newFundingRate, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get current domain index price (weighted average of top domains)
     */
    function getCurrentDomainIndexPrice() public view returns (uint256) {
        uint256 totalWeightedPrice = 0;
        uint256 totalWeight = 0;
        
        for (uint256 i = 0; i < trackedDomains.length; i++) {
            string memory domain = trackedDomains[i];
            uint256 price = domainPrices[domain];
            uint256 weight = _getDomainWeight(domain);
            
            totalWeightedPrice += price * weight;
            totalWeight += weight;
        }
        
        return totalWeight > 0 ? totalWeightedPrice / totalWeight : PRICE_PRECISION;
    }
    
    /**
     * @dev Get pool metrics
     */
    function getPoolMetrics() external view returns (
        uint256 tvl,
        uint256 openInterest,
        int256 fundingRate,
        uint256 lastUpdate,
        uint256 totalPositions,
        uint256 totalVolume
    ) {
        return (
            poolMetrics.totalValueLocked,
            poolMetrics.totalOpenInterest,
            poolMetrics.currentFundingRate,
            poolMetrics.lastFundingUpdate,
            poolMetrics.totalPositions,
            poolMetrics.totalVolume
        );
    }
    
    /**
     * @dev Get user positions
     * @param user User address
     */
    function getUserPositions(address user) external view returns (uint256[] memory) {
        return userPositions[user];
    }
    
    /**
     * @dev Get position details
     * @param positionId Position ID
     */
    function getPosition(uint256 positionId) external view returns (Position memory) {
        return positions[positionId];
    }
    
    // ============ Internal Functions ============
    
    function _calculatePnL(Position memory position, uint256 currentPrice) internal pure returns (int256) {
        int256 priceChange;
        if (position.isLong) {
            priceChange = int256(currentPrice) - int256(position.entryPrice);
        } else {
            priceChange = int256(position.entryPrice) - int256(currentPrice);
        }
        
        return (priceChange * int256(position.size)) / int256(PRICE_PRECISION);
    }
    
    function _calculateTradingFees(uint256 size) internal pure returns (uint256) {
        return (size * 30) / 10000; // 0.3% trading fee
    }
    
    function _getDomainWeight(string memory domain) internal pure returns (uint256) {
        // Simplified weight calculation based on domain popularity
        // In production, this would be more sophisticated
        bytes memory domainBytes = bytes(domain);
        if (domainBytes.length <= 3) return 1000; // Short domains get higher weight
        if (domainBytes.length <= 6) return 500;
        return 100;
    }
    
    function _removeUserPosition(address user, uint256 positionId) internal {
        uint256[] storage userPos = userPositions[user];
        for (uint256 i = 0; i < userPos.length; i++) {
            if (userPos[i] == positionId) {
                userPos[i] = userPos[userPos.length - 1];
                userPos.pop();
                break;
            }
        }
    }
    
    function _initializeTrackedDomains() internal {
        // Top 100 most traded domains (simplified list)
        trackedDomains = [
            "google.com", "facebook.com", "youtube.com", "amazon.com", "wikipedia.org",
            "twitter.com", "instagram.com", "linkedin.com", "reddit.com", "netflix.com",
            "microsoft.com", "apple.com", "github.com", "stackoverflow.com", "medium.com",
            "spotify.com", "pinterest.com", "tumblr.com", "flickr.com", "vimeo.com"
            // ... would continue with full list of 100 domains
        ];
        
        // Initialize with default prices
        for (uint256 i = 0; i < trackedDomains.length; i++) {
            domainPrices[trackedDomains[i]] = PRICE_PRECISION; // $1 base price
        }
    }
    
    // ============ Emergency Functions ============
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
