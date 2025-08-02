import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Volume2, VolumeX, Plus, Minus } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WorkoutTimerProps {
  type: 'rest' | 'exercise' | 'interval';
  duration: number; // in seconds
  endTime?: number; // timestamp when timer should end
  title?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  onAdjust?: (newDuration: number) => void;
  autoStart?: boolean;
  showControls?: boolean;
  enableSound?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export default function WorkoutTimer({
  type,
  duration,
  endTime,
  title,
  onComplete,
  onSkip,
  onAdjust,
  autoStart = false,
  showControls = true,
  enableSound = true,
  variant = 'default'
}: WorkoutTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for timer completion
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
    
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'rest' ? 800 : 600;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    if (soundEnabled && audioRef.current) {
      audioRef.current.addEventListener('loadeddata', () => {
        // Fallback to beep if no audio file is available
        if (!audioRef.current?.src) {
          audioRef.current = {
            play: createBeepSound
          } as HTMLAudioElement;
        }
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [soundEnabled, type]);

  // Update timer based on endTime
  useEffect(() => {
    if (endTime && isRunning) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setIsRunning(false);
          if (soundEnabled && audioRef.current) {
            audioRef.current.play().catch(() => {
              // Fallback beep if audio fails
            });
          }
          onComplete?.();
        }
      };

      updateTimer();
      intervalRef.current = setInterval(updateTimer, 100);
    } else if (!endTime && isRunning) {
      // Countdown timer without specific end time
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            setIsRunning(false);
            if (soundEnabled && audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            onComplete?.();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, endTime, onComplete, soundEnabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeRemaining) / duration) * 100;

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(duration);
  };

  const adjustTime = (adjustment: number) => {
    const newDuration = Math.max(5, duration + adjustment);
    setTimeRemaining(newDuration);
    onAdjust?.(newDuration);
  };

  const getTimerColor = () => {
    switch (type) {
      case 'rest':
        return 'bg-blue-500';
      case 'exercise':
        return 'bg-green-500';
      case 'interval':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'rest':
        return 'Rest';
      case 'exercise':
        return 'Exercise';
      case 'interval':
        return 'Interval';
      default:
        return 'Timer';
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={timeRemaining <= 10 ? 'destructive' : 'secondary'} className="text-lg font-mono">
          {formatTime(timeRemaining)}
        </Badge>
        {showControls && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTimer}
            className="h-8 w-8 p-0"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{getTypeLabel()}</Badge>
            {showControls && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="h-8 w-8 p-0"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
          </div>
          
          <div className="text-center mb-3">
            <div className={cn(
              "text-3xl font-mono font-bold",
              timeRemaining <= 10 ? "text-red-500 animate-pulse" : "text-foreground"
            )}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          <Progress 
            value={progress} 
            className="mb-3 h-2"
          />
          
          {showControls && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTimer}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetTimer}
              >
                <Square className="h-4 w-4" />
              </Button>
              
              {onSkip && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSkip}
                >
                  Skip
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Badge variant="outline" className="mb-1">
              {getTypeLabel()}
            </Badge>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
          </div>
          
          {showControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8 p-0"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <div className="text-center mb-6">
          <div className={cn(
            "text-6xl font-mono font-bold mb-2",
            timeRemaining <= 10 ? "text-red-500 animate-pulse" : "text-foreground"
          )}>
            {formatTime(timeRemaining)}
          </div>
          
          {showControls && onAdjust && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustTime(-15)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Adjust</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustTime(15)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className={cn("mb-6 h-3", getTimerColor())}
        />
        
        {showControls && (
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={toggleTimer}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetTimer}
            >
              <Square className="h-4 w-4" />
            </Button>
            
            {onSkip && (
              <Button
                variant="default"
                onClick={onSkip}
              >
                Skip
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}