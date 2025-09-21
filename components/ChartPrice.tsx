'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { ChartData, PriceData, FundingData } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ChartPriceProps {
  data: ChartData[];
  fundingData?: FundingData[];
  height?: number;
  showFunding?: boolean;
  className?: string;
}

export const ChartPrice: React.FC<ChartPriceProps> = ({
  data,
  fundingData = [],
  height = 400,
  showFunding = true,
  className = '',
}) => {
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Prepare price data
  const priceChartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Price',
        data: data.map(d => d.close),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // Prepare funding data
  const fundingChartData = {
    labels: fundingData.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Funding Rate',
        data: fundingData.map(d => d.rate * 100), // Convert to percentage
        backgroundColor: fundingData.map(d => 
          d.rate > 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)'
        ),
        borderColor: fundingData.map(d => 
          d.rate > 0 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'DomainETF Price Chart',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 0) {
              return `Price: ${formatCurrency(context.parsed.y)}`;
            }
            return `Funding: ${formatPercentage(context.parsed.y / 100)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Price (USD)',
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: showFunding,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Funding Rate (%)',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return `${value.toFixed(4)}%`;
          },
        },
      },
    },
  };

  const fundingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Funding Rate',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Funding Rate (%)',
        },
        ticks: {
          callback: function(value: any) {
            return `${value.toFixed(4)}%`;
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-${height} bg-muted rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-muted-foreground">No price data available</p>
          <p className="text-sm text-muted-foreground">Connect to price feed to see live data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'line'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setChartType('candlestick')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'candlestick'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Candlestick
          </button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Last update: {new Date(data[data.length - 1]?.timestamp || Date.now()).toLocaleTimeString()}
        </div>
      </div>

      {/* Price Chart */}
      <div style={{ height: `${height}px` }} className="relative">
        {chartType === 'line' ? (
          <Line ref={chartRef} data={priceChartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted rounded-lg">
            <p className="text-muted-foreground">Candlestick chart coming soon</p>
          </div>
        )}
      </div>

      {/* Funding Chart */}
      {showFunding && fundingData.length > 0 && (
        <div style={{ height: '200px' }} className="relative">
          <Bar data={fundingChartData} options={fundingOptions} />
        </div>
      )}
    </div>
  );
};
