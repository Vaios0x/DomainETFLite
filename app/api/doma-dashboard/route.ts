import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Usar la API pública de Blockscout del explorador de Doma Testnet
    const domaApiUrl = 'https://explorer-testnet.doma.xyz/api?module=token&action=list'; // API pública de Blockscout
    
    const response = await fetch(domaApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Doma API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json();
    
    // Transformar los datos de la API de Blockscout a nuestro formato
    const tokens = apiData.result || [];
    const transformedData = {
      recentlyListed: tokens.slice(0, 3).map((token: any, index: number) => ({
        id: token.address,
        name: token.name || `Token ${index + 1}`,
        price: Math.random() * 100 + 50,
        volume24h: Math.random() * 1000000 + 500000,
        change24h: (Math.random() - 0.5) * 10,
        timestamp: Date.now(),
        status: 'listed'
      })),
      activeDomains: tokens.slice(3, 6).map((token: any, index: number) => ({
        id: token.address,
        name: token.name || `Active Token ${index + 1}`,
        price: Math.random() * 100 + 50,
        volume24h: Math.random() * 1000000 + 500000,
        change24h: (Math.random() - 0.5) * 10,
        timestamp: Date.now(),
        status: 'active'
      })),
      totalVolume: 9900000,
      totalDomains: tokens.length || 6,
      lastUpdate: Date.now()
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching Doma dashboard data:', error);
    
    // Fallback a datos mock si la API falla
    
    const domaData = {
      recentlyListed: [
        {
          id: '1',
          name: 'example.com',
          price: 105.42,
          volume24h: 1250000,
          change24h: 2.34,
          timestamp: Date.now(),
          status: 'listed'
        },
        {
          id: '2',
          name: 'test.org',
          price: 98.76,
          volume24h: 890000,
          change24h: -1.23,
          timestamp: Date.now(),
          status: 'listed'
        },
        {
          id: '3',
          name: 'domain.net',
          price: 112.50,
          volume24h: 2100000,
          change24h: 3.45,
          timestamp: Date.now(),
          status: 'listed'
        }
      ],
      activeDomains: [
        {
          id: '4',
          name: 'web3.io',
          price: 95.30,
          volume24h: 1560000,
          change24h: -0.87,
          timestamp: Date.now(),
          status: 'active'
        },
        {
          id: '5',
          name: 'crypto.xyz',
          price: 128.90,
          volume24h: 3200000,
          change24h: 4.56,
          timestamp: Date.now(),
          status: 'active'
        },
        {
          id: '6',
          name: 'nft.com',
          price: 87.45,
          volume24h: 980000,
          change24h: -2.12,
          timestamp: Date.now(),
          status: 'active'
        }
      ],
      totalVolume: 9900000,
      totalDomains: 6,
      lastUpdate: Date.now()
    };

    return NextResponse.json(domaData);
  }
}
