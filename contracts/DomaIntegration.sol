// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DomaIntegration
 * @dev Integration contract for Doma Protocol DomainFi ecosystem
 * @notice Handles domain tokenization, fractionalization, and synthetic token management
 */
contract DomaIntegration is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ Doma Protocol Interfaces ============
    
    interface IDomaRegistry {
        function isTokenized(string memory domain) external view returns (bool);
        function getDomainToken(string memory domain) external view returns (address);
        function tokenizeDomain(string memory domain, address owner) external returns (address);
        function detokenizeDomain(string memory domain) external;
    }
    
    interface IDomainOwnershipToken {
        function owner() external view returns (address);
        function transfer(address to, uint256 tokenId) external;
        function approve(address to, uint256 tokenId) external;
        function getApproved(uint256 tokenId) external view returns (address);
    }
    
    interface IDomainSyntheticToken {
        function mint(address to, uint256 amount) external;
        function burn(address from, uint256 amount) external;
        function balanceOf(address account) external view returns (uint256);
        function totalSupply() external view returns (uint256);
    }
    
    interface IDomaFractionalization {
        function fractionalizeDomain(address domainToken, uint256 tokenId) external returns (address);
        function defractionalizeDomain(address syntheticToken) external;
    }
    
    // ============ State Variables ============
    
    IDomaRegistry public immutable domaRegistry;
    IDomaFractionalization public immutable domaFractionalization;
    
    struct DomainAsset {
        string domain;
        address ownershipToken;
        address syntheticToken;
        uint256 totalSupply;
        uint256 currentPrice;
        bool isFractionalized;
        bool isActive;
        uint256 lastPriceUpdate;
    }
    
    struct SyntheticTokenInfo {
        string domain;
        string tokenType; // "DNS", "SUBDOMAIN", "TRANSFER", "RENEWAL"
        uint256 totalSupply;
        uint256 price;
        bool isActive;
    }
    
    // ============ Storage ============
    
    mapping(string => DomainAsset) public domainAssets;
    mapping(address => SyntheticTokenInfo) public syntheticTokens;
    mapping(address => mapping(string => uint256)) public userSyntheticBalances;
    mapping(address => uint256[]) public userDomainTokens;
    
    string[] public trackedDomains;
    address[] public activeSyntheticTokens;
    
    // ============ Events ============
    
    event DomainTokenized(
        string indexed domain,
        address indexed ownershipToken,
        address indexed owner
    );
    
    event DomainFractionalized(
        string indexed domain,
        address indexed syntheticToken,
        uint256 totalSupply
    );
    
    event SyntheticTokenTraded(
        address indexed syntheticToken,
        address indexed trader,
        uint256 amount,
        uint256 price,
        bool isBuy
    );
    
    event DomainPriceUpdated(
        string indexed domain,
        uint256 newPrice,
        uint256 timestamp
    );
    
    event SyntheticTokenCreated(
        address indexed token,
        string indexed domain,
        string tokenType,
        uint256 totalSupply
    );
    
    // ============ Constructor ============
    
    constructor(
        address _domaRegistry,
        address _domaFractionalization
    ) {
        domaRegistry = IDomaRegistry(_domaRegistry);
        domaFractionalization = IDomaFractionalization(_domaFractionalization);
    }
    
    // ============ Domain Tokenization Functions ============
    
    /**
     * @dev Tokenize a domain through Doma Protocol
     * @param domain Domain name to tokenize
     */
    function tokenizeDomain(string memory domain) external nonReentrant {
        require(!domainAssets[domain].isActive, "Domain already tokenized");
        require(domaRegistry.isTokenized(domain), "Domain not available for tokenization");
        
        // Tokenize domain through Doma Protocol
        address ownershipToken = domaRegistry.getDomainToken(domain);
        require(ownershipToken != address(0), "Tokenization failed");
        
        // Create domain asset record
        domainAssets[domain] = DomainAsset({
            domain: domain,
            ownershipToken: ownershipToken,
            syntheticToken: address(0),
            totalSupply: 0,
            currentPrice: 1e18, // $1 base price
            isFractionalized: false,
            isActive: true,
            lastPriceUpdate: block.timestamp
        });
        
        trackedDomains.push(domain);
        
        emit DomainTokenized(domain, ownershipToken, msg.sender);
    }
    
    /**
     * @dev Fractionalize a domain into synthetic tokens
     * @param domain Domain to fractionalize
     * @param totalSupply Total supply of synthetic tokens
     */
    function fractionalizeDomain(
        string memory domain,
        uint256 totalSupply
    ) external nonReentrant {
        DomainAsset storage asset = domainAssets[domain];
        require(asset.isActive, "Domain not tokenized");
        require(!asset.isFractionalized, "Domain already fractionalized");
        require(totalSupply > 0, "Invalid total supply");
        
        // Get domain ownership token
        IDomainOwnershipToken ownershipToken = IDomainOwnershipToken(asset.ownershipToken);
        require(ownershipToken.owner() == msg.sender, "Not domain owner");
        
        // Fractionalize through Doma Protocol
        address syntheticToken = domaFractionalization.fractionalizeDomain(
            asset.ownershipToken,
            1 // tokenId (assuming single token per domain)
        );
        
        // Update asset record
        asset.syntheticToken = syntheticToken;
        asset.totalSupply = totalSupply;
        asset.isFractionalized = true;
        
        // Create synthetic token info
        syntheticTokens[syntheticToken] = SyntheticTokenInfo({
            domain: domain,
            tokenType: "OWNERSHIP",
            totalSupply: totalSupply,
            price: asset.currentPrice,
            isActive: true
        });
        
        activeSyntheticTokens.push(syntheticToken);
        
        emit DomainFractionalized(domain, syntheticToken, totalSupply);
    }
    
    /**
     * @dev Create synthetic tokens for specific domain rights
     * @param domain Domain name
     * @param tokenType Type of synthetic token (DNS, SUBDOMAIN, etc.)
     * @param totalSupply Total supply of synthetic tokens
     */
    function createSyntheticToken(
        string memory domain,
        string memory tokenType,
        uint256 totalSupply
    ) external nonReentrant {
        DomainAsset storage asset = domainAssets[domain];
        require(asset.isActive, "Domain not tokenized");
        require(asset.isFractionalized, "Domain must be fractionalized first");
        
        // Create synthetic token contract (simplified - in production would use factory)
        address syntheticToken = _deploySyntheticToken(domain, tokenType, totalSupply);
        
        // Update synthetic token info
        syntheticTokens[syntheticToken] = SyntheticTokenInfo({
            domain: domain,
            tokenType: tokenType,
            totalSupply: totalSupply,
            price: asset.currentPrice / 4, // 25% of domain price
            isActive: true
        });
        
        activeSyntheticTokens.push(syntheticToken);
        
        emit SyntheticTokenCreated(syntheticToken, domain, tokenType, totalSupply);
    }
    
    // ============ Trading Functions ============
    
    /**
     * @dev Trade synthetic tokens
     * @param syntheticToken Address of synthetic token
     * @param amount Amount to trade
     * @param isBuy True for buy, false for sell
     */
    function tradeSyntheticToken(
        address syntheticToken,
        uint256 amount,
        bool isBuy
    ) external nonReentrant {
        SyntheticTokenInfo storage tokenInfo = syntheticTokens[syntheticToken];
        require(tokenInfo.isActive, "Token not active");
        require(amount > 0, "Invalid amount");
        
        IDomainSyntheticToken token = IDomainSyntheticToken(syntheticToken);
        uint256 price = tokenInfo.price;
        uint256 totalCost = amount * price;
        
        if (isBuy) {
            // Buy synthetic tokens
            require(token.balanceOf(address(this)) >= amount, "Insufficient token supply");
            require(IERC20(tokenInfo.domain).balanceOf(msg.sender) >= totalCost, "Insufficient funds");
            
            // Transfer payment (simplified - would use proper payment token)
            // Transfer synthetic tokens to buyer
            token.transfer(msg.sender, amount);
            
            userSyntheticBalances[msg.sender][tokenInfo.domain] += amount;
        } else {
            // Sell synthetic tokens
            require(userSyntheticBalances[msg.sender][tokenInfo.domain] >= amount, "Insufficient balance");
            
            // Transfer synthetic tokens back
            token.transferFrom(msg.sender, address(this), amount);
            
            userSyntheticBalances[msg.sender][tokenInfo.domain] -= amount;
            
            // Transfer payment to seller (simplified)
        }
        
        emit SyntheticTokenTraded(syntheticToken, msg.sender, amount, price, isBuy);
    }
    
    // ============ Price Oracle Functions ============
    
    /**
     * @dev Update domain price (only callable by oracle)
     * @param domain Domain name
     * @param newPrice New price in wei
     */
    function updateDomainPrice(
        string memory domain,
        uint256 newPrice
    ) external onlyOwner {
        DomainAsset storage asset = domainAssets[domain];
        require(asset.isActive, "Domain not active");
        
        asset.currentPrice = newPrice;
        asset.lastPriceUpdate = block.timestamp;
        
        // Update synthetic token prices proportionally
        for (uint256 i = 0; i < activeSyntheticTokens.length; i++) {
            SyntheticTokenInfo storage tokenInfo = syntheticTokens[activeSyntheticTokens[i]];
            if (keccak256(bytes(tokenInfo.domain)) == keccak256(bytes(domain))) {
                if (keccak256(bytes(tokenInfo.tokenType)) == keccak256(bytes("OWNERSHIP"))) {
                    tokenInfo.price = newPrice;
                } else {
                    // Other token types get proportional pricing
                    tokenInfo.price = newPrice / 4;
                }
            }
        }
        
        emit DomainPriceUpdated(domain, newPrice, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get domain asset information
     * @param domain Domain name
     */
    function getDomainAsset(string memory domain) external view returns (DomainAsset memory) {
        return domainAssets[domain];
    }
    
    /**
     * @dev Get synthetic token information
     * @param syntheticToken Address of synthetic token
     */
    function getSyntheticTokenInfo(address syntheticToken) external view returns (SyntheticTokenInfo memory) {
        return syntheticTokens[syntheticToken];
    }
    
    /**
     * @dev Get user's synthetic token balances
     * @param user User address
     * @param domain Domain name
     */
    function getUserSyntheticBalance(address user, string memory domain) external view returns (uint256) {
        return userSyntheticBalances[user][domain];
    }
    
    /**
     * @dev Get all tracked domains
     */
    function getTrackedDomains() external view returns (string[] memory) {
        return trackedDomains;
    }
    
    /**
     * @dev Get all active synthetic tokens
     */
    function getActiveSyntheticTokens() external view returns (address[] memory) {
        return activeSyntheticTokens;
    }
    
    /**
     * @dev Get domain price from Doma Protocol
     * @param domain Domain name
     */
    function getDomainPrice(string memory domain) external view returns (uint256) {
        return domainAssets[domain].currentPrice;
    }
    
    // ============ Internal Functions ============
    
    function _deploySyntheticToken(
        string memory domain,
        string memory tokenType,
        uint256 totalSupply
    ) internal returns (address) {
        // Simplified deployment - in production would use proper factory pattern
        // This is a placeholder for the actual synthetic token deployment
        return address(uint160(uint256(keccak256(abi.encodePacked(domain, tokenType, block.timestamp)))));
    }
    
    // ============ Emergency Functions ============
    
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
    }
    
    function emergencyUnpause() external onlyOwner {
        // Implementation for emergency unpause
    }
}
