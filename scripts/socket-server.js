const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Mock price data generator
function generateMockPrice() {
  const basePrice = 100;
  const variation = (Math.random() - 0.5) * 2; // ±1 price variation
  return basePrice + variation;
}

function generateMockFunding() {
  return (Math.random() - 0.5) * 0.01; // ±0.5% funding rate
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('priceUpdate', {
    price: generateMockPrice(),
    volume24h: Math.random() * 1000000,
    change24h: (Math.random() - 0.5) * 10,
    timestamp: Date.now(),
  });

  socket.emit('fundingUpdate', {
    rate: generateMockFunding(),
    timestamp: Date.now(),
    nextUpdate: Date.now() + 600000, // 10 minutes
  });

  // Send periodic updates
  const priceInterval = setInterval(() => {
    socket.emit('priceUpdate', {
      price: generateMockPrice(),
      volume24h: Math.random() * 1000000,
      change24h: (Math.random() - 0.5) * 10,
      timestamp: Date.now(),
    });
  }, 5000); // Every 5 seconds

  const fundingInterval = setInterval(() => {
    socket.emit('fundingUpdate', {
      rate: generateMockFunding(),
      timestamp: Date.now(),
      nextUpdate: Date.now() + 600000, // 10 minutes
    });
  }, 30000); // Every 30 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(priceInterval);
    clearInterval(fundingInterval);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
  console.log(`Connect to: http://localhost:${PORT}`);
});
