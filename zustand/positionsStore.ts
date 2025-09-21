import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Position } from '@/types';

interface PositionsStore {
  positions: Position[];
  addPosition: (position: Position) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  clearPositions: () => void;
  getPositionById: (id: string) => Position | undefined;
  getUserPositions: (userAddress: string) => Position[];
}

export const usePositionsStore = create<PositionsStore>()(
  persist(
    (set, get) => ({
      positions: [],

      addPosition: (position: Position) =>
        set((state) => ({
          positions: [...state.positions, position],
        })),

      removePosition: (id: string) =>
        set((state) => ({
          positions: state.positions.filter((pos) => pos.id !== id),
        })),

      updatePosition: (id: string, updates: Partial<Position>) =>
        set((state) => ({
          positions: state.positions.map((pos) =>
            pos.id === id ? { ...pos, ...updates } : pos
          ),
        })),

      clearPositions: () =>
        set(() => ({
          positions: [],
        })),

      getPositionById: (id: string) => {
        const state = get();
        return state.positions.find((pos) => pos.id === id);
      },

      getUserPositions: (userAddress: string) => {
        const state = get();
        return state.positions.filter((pos) => pos.user === userAddress);
      },
    }),
    {
      name: 'positions-storage',
      partialize: (state) => ({ positions: state.positions }),
    }
  )
);
