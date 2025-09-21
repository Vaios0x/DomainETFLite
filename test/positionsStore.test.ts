import { describe, it, expect, beforeEach } from 'vitest';
import { usePositionsStore } from '@/zustand/positionsStore';
import { Position } from '@/types';

describe('PositionsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePositionsStore.getState().clearPositions();
  });

  it('should add a position', () => {
    const position: Position = {
      id: '1',
      size: 100,
      isLong: true,
      leverage: 3,
      entryPrice: 100,
      currentPrice: 105,
      pnl: 15,
      timestamp: Date.now(),
      user: '0x123',
    };

    usePositionsStore.getState().addPosition(position);
    
    const positions = usePositionsStore.getState().positions;
    expect(positions).toHaveLength(1);
    expect(positions[0]).toEqual(position);
  });

  it('should remove a position', () => {
    const position: Position = {
      id: '1',
      size: 100,
      isLong: true,
      leverage: 3,
      entryPrice: 100,
      currentPrice: 105,
      pnl: 15,
      timestamp: Date.now(),
      user: '0x123',
    };

    usePositionsStore.getState().addPosition(position);
    usePositionsStore.getState().removePosition('1');
    
    const positions = usePositionsStore.getState().positions;
    expect(positions).toHaveLength(0);
  });

  it('should update a position', () => {
    const position: Position = {
      id: '1',
      size: 100,
      isLong: true,
      leverage: 3,
      entryPrice: 100,
      currentPrice: 105,
      pnl: 15,
      timestamp: Date.now(),
      user: '0x123',
    };

    usePositionsStore.getState().addPosition(position);
    usePositionsStore.getState().updatePosition('1', { pnl: 20 });
    
    const positions = usePositionsStore.getState().positions;
    expect(positions[0].pnl).toBe(20);
  });

  it('should get position by id', () => {
    const position: Position = {
      id: '1',
      size: 100,
      isLong: true,
      leverage: 3,
      entryPrice: 100,
      currentPrice: 105,
      pnl: 15,
      timestamp: Date.now(),
      user: '0x123',
    };

    usePositionsStore.getState().addPosition(position);
    
    const foundPosition = usePositionsStore.getState().getPositionById('1');
    expect(foundPosition).toEqual(position);
  });

  it('should get user positions', () => {
    const position1: Position = {
      id: '1',
      size: 100,
      isLong: true,
      leverage: 3,
      entryPrice: 100,
      currentPrice: 105,
      pnl: 15,
      timestamp: Date.now(),
      user: '0x123',
    };

    const position2: Position = {
      id: '2',
      size: 200,
      isLong: false,
      leverage: 2,
      entryPrice: 100,
      currentPrice: 95,
      pnl: 10,
      timestamp: Date.now(),
      user: '0x456',
    };

    usePositionsStore.getState().addPosition(position1);
    usePositionsStore.getState().addPosition(position2);
    
    const userPositions = usePositionsStore.getState().getUserPositions('0x123');
    expect(userPositions).toHaveLength(1);
    expect(userPositions[0]).toEqual(position1);
  });

  it('should clear all positions', () => {
    const position: Position = {
      id: '1',
      size: 100,
      isLong: true,
      leverage: 3,
      entryPrice: 100,
      currentPrice: 105,
      pnl: 15,
      timestamp: Date.now(),
      user: '0x123',
    };

    usePositionsStore.getState().addPosition(position);
    usePositionsStore.getState().clearPositions();
    
    const positions = usePositionsStore.getState().positions;
    expect(positions).toHaveLength(0);
  });
});
