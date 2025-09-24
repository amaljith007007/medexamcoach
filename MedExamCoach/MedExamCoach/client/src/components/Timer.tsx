import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, Square, RotateCcw, ChevronDown, ChevronUp, X, Eye, EyeOff } from "lucide-react";

interface TimerProps {
  duration: number; // Duration in seconds
  isActive?: boolean;
  onTimeUp?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  showControls?: boolean;
  variant?: "default" | "compact" | "practice";
  allowMinimize?: boolean;
  nonInterfering?: boolean; // For practice mode - doesn't auto-trigger actions
  countUp?: boolean; // For practice mode - count up from 0 instead of down
}

export default function Timer({
  duration,
  isActive = false,
  onTimeUp,
  onPause,
  onResume,
  onStop,
  onReset,
  showControls = true,
  variant = "default",
  allowMinimize = false,
  nonInterfering = false,
  countUp = false
}: TimerProps) {
  // Practice variant should be non-interfering by default and count up
  const effectiveNonInterfering = variant === 'practice' ? true : nonInterfering;
  const effectiveAllowMinimize = variant === 'practice' ? true : allowMinimize;
  const effectiveCountUp = variant === 'practice' ? true : countUp;
  
  const [timeLeft, setTimeLeft] = useState(effectiveCountUp ? 0 : duration);
  const [isPaused, setIsPaused] = useState(!isActive);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setTimeLeft(effectiveCountUp ? 0 : duration);
  }, [duration, effectiveCountUp]);

  useEffect(() => {
    if (!isActive || isPaused) return;
    if (!effectiveCountUp && timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (effectiveCountUp) {
          // Count up mode - just increment
          return prev + 1;
        } else {
          // Count down mode - original behavior
          if (prev <= 1) {
            if (!effectiveNonInterfering) {
              onTimeUp?.();
            }
            return 0;
          }
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, onTimeUp, effectiveNonInterfering, effectiveCountUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // For count-up mode, we don't have critical/low time indicators
  const progressPercent = effectiveCountUp ? 0 : ((duration - timeLeft) / duration) * 100;
  const isLowTime = effectiveCountUp ? false : timeLeft <= 300; // Last 5 minutes
  const isCriticalTime = effectiveCountUp ? false : timeLeft <= 60; // Last minute

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const handleStop = () => {
    setTimeLeft(duration);
    setIsPaused(true);
    onStop?.();
  };

  const handleReset = () => {
    setTimeLeft(effectiveCountUp ? 0 : duration);
    setIsPaused(true);
    onReset?.();
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${isCriticalTime ? 'text-red-600' : isLowTime ? 'text-yellow-600' : 'text-foreground'}`}>
        <Clock className="h-4 w-4" />
        <span className="font-mono text-sm font-medium" data-testid="text-timer-compact">
          {formatTime(timeLeft)}
        </span>
      </div>
    );
  }

  if (variant === "practice") {
    // If hidden, show only a small show button
    if (isHidden) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHidden(false)}
            className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-2"
            data-testid="button-timer-show"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="fixed top-4 right-4 z-50">
        <div className={`bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg transition-all duration-300 ${
          isMinimized ? 'p-2' : 'p-4'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${
                effectiveNonInterfering ? 'text-muted-foreground' : 
                isCriticalTime ? 'text-red-500' : 
                isLowTime ? 'text-yellow-500' : 
                'text-primary'
              }`} />
              <span className={`font-mono text-sm font-medium ${
                effectiveNonInterfering ? 'text-muted-foreground' : 
                isCriticalTime ? 'text-red-500' : 
                isLowTime ? 'text-yellow-500' : 
                'text-foreground'
              }`} data-testid="text-timer-practice">
                {formatTime(timeLeft)}
              </span>
              <Badge variant="outline">
                Practice
              </Badge>
            </div>
            
            {!isMinimized && showControls && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isPaused ? handleResume : handlePause}
                  disabled={!effectiveCountUp && timeLeft === 0}
                  data-testid="button-timer-toggle-practice"
                >
                  {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  data-testid="button-timer-reset-practice"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {effectiveAllowMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                data-testid="button-timer-minimize"
              >
                {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHidden(true)}
              data-testid="button-timer-hide"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
          
          {!isMinimized && !effectiveNonInterfering && (
            <div className="mt-2">
              <Progress 
                value={progressPercent} 
                className={`h-1 ${
                  isCriticalTime ? '[&>div]:bg-red-500' : 
                  isLowTime ? '[&>div]:bg-yellow-500' : 
                  '[&>div]:bg-primary'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className={`h-5 w-5 ${isCriticalTime ? 'text-red-600' : isLowTime ? 'text-yellow-600' : 'text-primary'}`} />
              <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
            </div>
            <div 
              className={`text-4xl font-mono font-bold ${
                isCriticalTime ? 'text-red-600' : 
                isLowTime ? 'text-yellow-600' : 
                'text-foreground'
              }`}
              data-testid="text-timer-display"
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="space-y-2">
            <Progress 
              value={progressPercent} 
              className={`h-2 ${
                isCriticalTime ? '[&>div]:bg-red-500' : 
                isLowTime ? '[&>div]:bg-yellow-500' : 
                ''
              }`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {showControls && (
            <div className="flex justify-center gap-2">
              {isPaused ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResume}
                  disabled={!effectiveCountUp && timeLeft === 0}
                  data-testid="button-timer-resume"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePause}
                  data-testid="button-timer-pause"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                data-testid="button-timer-reset"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                data-testid="button-timer-stop"
              >
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </div>
          )}

          {timeLeft === 0 && (
            <div className="text-center text-red-600 font-medium">
              Time's up!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}