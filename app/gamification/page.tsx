'use client';

import React from 'react';
import { Gamification } from '@/components/Gamification';
import { Trophy } from 'lucide-react';

export default function GamificationPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Gamification
          </h1>
          <p className="text-muted-foreground">
            Track your progress, unlock achievements, and compete with other traders
          </p>
        </div>
      </div>

      {/* Gamification Component */}
      <Gamification />
    </div>
  );
}
