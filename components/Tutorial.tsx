'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Trophy,
  Globe
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'scroll' | 'wait';
  actionTarget?: string;
  completed?: boolean;
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DomainETF Lite!',
    description: 'Learn how to trade perpetual swaps on domain names. This tutorial will guide you through the key features.',
    target: 'body',
    position: 'top',
  },
  {
    id: 'connect-wallet',
    title: 'Connect Your Wallet',
    description: 'First, connect your Web3 wallet to start trading. Click the "Connect Wallet" button in the top right.',
    target: '[data-tutorial="connect-wallet"]',
    position: 'bottom',
    action: 'click',
    actionTarget: '[data-tutorial="connect-wallet"]',
  },
  {
    id: 'explore-dashboard',
    title: 'Explore the Dashboard',
    description: 'The dashboard shows key metrics: Total Value Locked, Open Interest, and current funding rate.',
    target: '[data-tutorial="dashboard-metrics"]',
    position: 'bottom',
  },
  {
    id: 'view-price-chart',
    title: 'Price Chart',
    description: 'Monitor domain price movements with our interactive chart. You can see historical data and funding rates.',
    target: '[data-tutorial="price-chart"]',
    position: 'left',
  },
  {
    id: 'start-trading',
    title: 'Start Trading',
    description: 'Navigate to the Trade page to open your first position. You can trade long or short with up to 50x leverage.',
    target: '[data-tutorial="trade-link"]',
    position: 'bottom',
    action: 'click',
    actionTarget: '[data-tutorial="trade-link"]',
  },
  {
    id: 'trading-interface',
    title: 'Trading Interface',
    description: 'Choose your position direction (Long/Short), set the size, and select leverage. The form shows estimated fill price and margin required.',
    target: '[data-tutorial="trading-form"]',
    position: 'right',
  },
  {
    id: 'manage-positions',
    title: 'Manage Positions',
    description: 'View and manage your open positions. You can close positions anytime and monitor your PnL in real-time.',
    target: '[data-tutorial="positions-table"]',
    position: 'top',
  },
  {
    id: 'provide-liquidity',
    title: 'Provide Liquidity',
    description: 'Earn fees by providing liquidity to the trading pool. Navigate to the Liquidity page to get started.',
    target: '[data-tutorial="liquidity-link"]',
    position: 'bottom',
    action: 'click',
    actionTarget: '[data-tutorial="liquidity-link"]',
  },
  {
    id: 'liquidity-interface',
    title: 'Liquidity Management',
    description: 'Add or remove liquidity to earn trading fees. Your rewards are proportional to your share of the total liquidity.',
    target: '[data-tutorial="liquidity-form"]',
    position: 'left',
  },
  {
    id: 'check-leaderboard',
    title: 'Leaderboard',
    description: 'See how you rank against other traders. The leaderboard shows top performers by 24h PnL.',
    target: '[data-tutorial="leaderboard-link"]',
    position: 'bottom',
    action: 'click',
    actionTarget: '[data-tutorial="leaderboard-link"]',
  },
  {
    id: 'domainfi-features',
    title: 'DomainFi Features',
    description: 'Explore DomainFi to tokenize domains, create synthetic tokens, and trade domain rights.',
    target: '[data-tutorial="domainfi-link"]',
    position: 'bottom',
    action: 'click',
    actionTarget: '[data-tutorial="domainfi-link"]',
  },
  {
    id: 'complete',
    title: 'Tutorial Complete!',
    description: 'You\'re ready to start trading! Remember to start small, manage your risk, and never invest more than you can afford to lose.',
    target: 'body',
    position: 'top',
  },
];

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const currentStepData = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  // Highlight target element
  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const targetElement = document.querySelector(currentStepData.target) as HTMLElement;
    if (targetElement) {
      setHighlightedElement(targetElement);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      setHighlightedElement(null);
    };
  }, [isOpen, currentStep]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < TUTORIAL_STEPS.length - 1) {
        nextStep();
      } else {
        setIsPlaying(false);
        completeTutorial();
      }
    }, 5000); // 5 seconds per step

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTutorial = () => {
    setCompletedSteps(new Set(Array.from(TUTORIAL_STEPS.map(step => step.id))));
    onComplete();
    onClose();
  };

  const handleAction = () => {
    if (currentStepData?.action === 'click' && currentStepData.actionTarget) {
      const element = document.querySelector(currentStepData.actionTarget) as HTMLElement;
      if (element) {
        element.click();
      }
    }
    
    // Mark step as completed
    setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStepData.id)));
    
    // Auto-advance after action
    setTimeout(() => {
      if (currentStep < TUTORIAL_STEPS.length - 1) {
        nextStep();
      }
    }, 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToEnd = () => {
    completeTutorial();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Highlight overlay */}
      {highlightedElement && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(circle at ${highlightedElement.offsetLeft + highlightedElement.offsetWidth / 2}px ${highlightedElement.offsetTop + highlightedElement.offsetHeight / 2}px, transparent 0px, transparent 100px, rgba(0,0,0,0.5) 150px)`,
          }}
        />
      )}

      {/* Tutorial Card */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Tutorial
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              <p className="text-sm text-muted-foreground">
                {currentStepData.description}
              </p>
            </div>

            {/* Action button */}
            {currentStepData.action && (
              <Button
                onClick={handleAction}
                className="w-full"
                size="sm"
              >
                {currentStepData.action === 'click' ? 'Click Here' : 'Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStep === TUTORIAL_STEPS.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={skipToEnd}
                className="text-muted-foreground"
              >
                Skip Tutorial
              </Button>
            </div>

            {/* Quick navigation */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {TUTORIAL_STEPS.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex-shrink-0 w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-primary'
                      : completedSteps.has(step.id)
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`}
                  title={step.title}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

// Tutorial trigger component
export const TutorialTrigger: React.FC = () => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('tutorial-completed');
    setHasCompletedTutorial(completed === 'true');
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('tutorial-completed', 'true');
    setHasCompletedTutorial(true);
  };

  if (hasCompletedTutorial) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsTutorialOpen(true)}
        className="fixed bottom-4 right-4 z-40 shadow-lg"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Take Tutorial
      </Button>

      <Tutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={handleTutorialComplete}
      />
    </>
  );
};
