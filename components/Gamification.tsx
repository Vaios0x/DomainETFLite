'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  Medal,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Lock,
  Gift,
  Crown
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'trading' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

interface Level {
  level: number;
  name: string;
  requiredPoints: number;
  rewards: string[];
  icon: React.ComponentType<any>;
  color: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  rewards: {
    points: number;
    xp: number;
    badge?: string;
  };
  objectives: {
    id: string;
    description: string;
    completed: boolean;
    progress: number;
    maxProgress: number;
  }[];
  completed: boolean;
  expiresAt: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-trade',
    title: 'First Steps',
    description: 'Complete your first trade',
    icon: TrendingUp,
    category: 'trading',
    rarity: 'common',
    points: 10,
    unlocked: false,
  },
  {
    id: 'profit-master',
    title: 'Profit Master',
    description: 'Make $1000 profit in a single trade',
    icon: DollarSign,
    category: 'trading',
    rarity: 'rare',
    points: 50,
    unlocked: false,
  },
  {
    id: 'risk-taker',
    title: 'Risk Taker',
    description: 'Use 50x leverage on a position',
    icon: Zap,
    category: 'trading',
    rarity: 'epic',
    points: 100,
    unlocked: false,
  },
  {
    id: 'liquidity-provider',
    title: 'Liquidity Provider',
    description: 'Provide $10,000 in liquidity',
    icon: Users,
    category: 'milestone',
    rarity: 'rare',
    points: 75,
    unlocked: false,
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Trade for 7 consecutive days',
    icon: Clock,
    category: 'milestone',
    rarity: 'epic',
    points: 150,
    unlocked: false,
  },
  {
    id: 'top-trader',
    title: 'Top Trader',
    description: 'Reach top 10 in leaderboard',
    icon: Crown,
    category: 'social',
    rarity: 'legendary',
    points: 500,
    unlocked: false,
  },
];

const LEVELS: Level[] = [
  { level: 1, name: 'Novice', requiredPoints: 0, rewards: ['Welcome badge'], icon: Star, color: 'text-gray-500' },
  { level: 2, name: 'Apprentice', requiredPoints: 100, rewards: ['Bronze badge'], icon: Medal, color: 'text-amber-600' },
  { level: 3, name: 'Trader', requiredPoints: 300, rewards: ['Silver badge'], icon: Award, color: 'text-gray-400' },
  { level: 4, name: 'Expert', requiredPoints: 600, rewards: ['Gold badge'], icon: Trophy, color: 'text-yellow-500' },
  { level: 5, name: 'Master', requiredPoints: 1000, rewards: ['Platinum badge'], icon: Crown, color: 'text-purple-500' },
  { level: 6, name: 'Legend', requiredPoints: 1500, rewards: ['Diamond badge'], icon: Star, color: 'text-blue-500' },
];

const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily-trade',
    title: 'Daily Trader',
    description: 'Complete 3 trades today',
    type: 'daily',
    rewards: { points: 25, xp: 50 },
    objectives: [
      {
        id: 'trade-count',
        description: 'Complete 3 trades',
        completed: false,
        progress: 0,
        maxProgress: 3,
      },
    ],
    completed: false,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  },
  {
    id: 'profit-hunter',
    title: 'Profit Hunter',
    description: 'Make $100 profit today',
    type: 'daily',
    rewards: { points: 30, xp: 60 },
    objectives: [
      {
        id: 'profit-target',
        description: 'Make $100 profit',
        completed: false,
        progress: 0,
        maxProgress: 100,
      },
    ],
    completed: false,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  },
];

interface GamificationState {
  level: number;
  points: number;
  xp: number;
  achievements: Achievement[];
  quests: Quest[];
  streak: number;
  lastActiveDate: string;
}

export const Gamification: React.FC = () => {
  const [state, setState] = useState<GamificationState>({
    level: 1,
    points: 0,
    xp: 0,
    achievements: ACHIEVEMENTS,
    quests: DAILY_QUESTS,
    streak: 0,
    lastActiveDate: new Date().toDateString(),
  });

  const [showAchievements, setShowAchievements] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Get current level info
  const currentLevel = LEVELS.find(l => l.level === state.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === state.level + 1);
  const levelProgress = nextLevel 
    ? ((state.points - currentLevel.requiredPoints) / (nextLevel.requiredPoints - currentLevel.requiredPoints)) * 100
    : 100;

  // Check for new achievements
  const checkAchievements = (action: string, data: any) => {
    const newAchievements = state.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      let progress = 0;

      switch (achievement.id) {
        case 'first-trade':
          if (action === 'trade' && data.count >= 1) {
            shouldUnlock = true;
          }
          break;
        case 'profit-master':
          if (action === 'profit' && data.amount >= 1000) {
            shouldUnlock = true;
          }
          progress = Math.min(100, (data.amount / 1000) * 100);
          break;
        case 'risk-taker':
          if (action === 'leverage' && data.leverage >= 50) {
            shouldUnlock = true;
          }
          break;
        case 'liquidity-provider':
          if (action === 'liquidity' && data.amount >= 10000) {
            shouldUnlock = true;
          }
          progress = Math.min(100, (data.amount / 10000) * 100);
          break;
        case 'streak-master':
          if (action === 'streak' && data.days >= 7) {
            shouldUnlock = true;
          }
          progress = Math.min(100, (data.days / 7) * 100);
          break;
        case 'top-trader':
          if (action === 'leaderboard' && data.rank <= 10) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: Date.now(),
          progress: 100,
        };
      }

      return {
        ...achievement,
        progress,
      };
    });

    const newlyUnlocked = newAchievements.filter(
      (achievement, index) => 
        achievement.unlocked && !state.achievements[index].unlocked
    );

    if (newlyUnlocked.length > 0) {
      setState(prev => ({
        ...prev,
        achievements: newAchievements,
        points: prev.points + newlyUnlocked.reduce((sum, a) => sum + a.points, 0),
      }));
      
      // Show achievement notification
      showAchievementNotification(newlyUnlocked[0]);
    }
  };

  // Show achievement notification
  const showAchievementNotification = (achievement: Achievement) => {
    // This would show a toast notification
    console.log(`Achievement unlocked: ${achievement.title}`);
  };

  // Check for level up
  useEffect(() => {
    const newLevel = LEVELS.find(l => state.points >= l.requiredPoints && l.level > state.level);
    if (newLevel) {
      setState(prev => ({ ...prev, level: newLevel.level }));
      setShowLevelUp(true);
    }
  }, [state.points, state.level]);

  // Update quest progress
  const updateQuestProgress = (questId: string, objectiveId: string, progress: number) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(quest => {
        if (quest.id !== questId) return quest;

        const updatedObjectives = quest.objectives.map(obj => {
          if (obj.id !== objectiveId) return obj;

          const newProgress = Math.min(progress, obj.maxProgress);
          const completed = newProgress >= obj.maxProgress;

          return {
            ...obj,
            progress: newProgress,
            completed,
          };
        });

        const questCompleted = updatedObjectives.every(obj => obj.completed);

        return {
          ...quest,
          objectives: updatedObjectives,
          completed: questCompleted,
        };
      }),
    }));
  };

  // Complete quest
  const completeQuest = (questId: string) => {
    const quest = state.quests.find(q => q.id === questId);
    if (!quest || !quest.completed) return;

    setState(prev => ({
      ...prev,
      points: prev.points + quest.rewards.points,
      xp: prev.xp + quest.rewards.xp,
    }));

    // Remove completed quest
    setState(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== questId),
    }));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <currentLevel.icon className={`h-5 w-5 ${currentLevel.color}`} />
            Level {state.level} - {currentLevel.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{state.points} points</span>
              <span>{nextLevel ? `${nextLevel.requiredPoints - state.points} to next level` : 'Max level'}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-xs text-muted-foreground">
                Next: {nextLevel.name} ({nextLevel.requiredPoints} points)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">{state.achievements.filter(a => a.unlocked).length}</p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{state.quests.filter(q => !q.completed).length}</p>
                <p className="text-xs text-muted-foreground">Active Quests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">{state.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{state.xp}</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Quests
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuests(!showQuests)}
            >
              {showQuests ? 'Hide' : 'Show All'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.quests.filter(q => !q.completed).slice(0, showQuests ? undefined : 2).map(quest => (
              <div key={quest.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{quest.title}</h4>
                  <Badge variant="outline">{quest.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
                
                <div className="space-y-2">
                  {quest.objectives.map(objective => (
                    <div key={objective.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{objective.description}</span>
                        <span>{objective.progress}/{objective.maxProgress}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${(objective.progress / objective.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {quest.completed && (
                  <Button
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => completeQuest(quest.id)}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Reward ({quest.rewards.points} points)
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              {showAchievements ? 'Hide' : 'Show All'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.achievements.slice(0, showAchievements ? undefined : 4).map(achievement => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? getRarityBg(achievement.rarity)
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked 
                        ? 'bg-primary/10' 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        achievement.unlocked 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${
                          achievement.unlocked ? '' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </h4>
                        {achievement.unlocked && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRarityColor(achievement.rarity)}`}
                        >
                          {achievement.rarity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {achievement.progress !== undefined && !achievement.unlocked && (
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1">
                        <div
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
