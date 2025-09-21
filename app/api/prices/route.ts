import { NextRequest, NextResponse } from 'next/server';

// Mock price data generator
function generateMockPrice() {
  const basePrice = 100;
  const variation = (Math.random() - 0.5) * 2; // ±1 price variation
  return basePrice + variation;
}

function generateMockFunding() {
  return (Math.random() - 0.5) * 0.01; // ±0.5% funding rate
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isStream = searchParams.get('stream') === 'true';

  if (!isStream) {
    // Return single price data
    return NextResponse.json({
      price: generateMockPrice(),
      funding: generateMockFunding(),
      volume24h: Math.random() * 1000000,
      change24h: (Math.random() - 0.5) * 10,
      timestamp: Date.now(),
    });
  }

  // Server-Sent Events stream
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const sendData = () => {
        const data = {
          price: generateMockPrice(),
          funding: generateMockFunding(),
          volume24h: Math.random() * 1000000,
          change24h: (Math.random() - 0.5) * 10,
          timestamp: Date.now(),
        };

        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial data
      sendData();

      // Send updates every 5 seconds
      const interval = setInterval(sendData, 5000);

      // Cleanup on close
      return () => {
        clearInterval(interval);
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
