import { Play, Pause, RotateCcw, Settings, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BattleControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onSaveTranscript: () => void;
  currentSpeed: number;
  battleProgress: number; // 0-100
}

export const BattleControls = ({
  isPlaying,
  onPlayPause,
  onRestart,
  onSpeedChange,
  onSaveTranscript,
  currentSpeed,
  battleProgress
}: BattleControlsProps) => {
  const speedOptions = [0.5, 1, 2, 4];

  return (
    <div className="space-y-4">
      {/* Battle Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Battle Progress</span>
          <span>{Math.round(battleProgress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-prosecution to-defense transition-all duration-500"
            style={{ width: `${battleProgress}%` }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-3">
        <Button
          onClick={onPlayPause}
          className="battle-control-primary"
          size="lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 mr-2" />
          ) : (
            <Play className="w-5 h-5 mr-2" />
          )}
          {isPlaying ? 'Pause' : 'Resume'} Battle
        </Button>

        <Button
          onClick={onRestart}
          className="battle-control-secondary"
          size="lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Speed:</span>
        {speedOptions.map((speed) => (
          <Button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            variant={currentSpeed === speed ? "default" : "outline"}
            size="sm"
            className={cn(
              "px-3 py-1 text-xs",
              currentSpeed === speed 
                ? "bg-primary text-primary-foreground" 
                : "battle-control-secondary"
            )}
          >
            {speed}x
          </Button>
        ))}
      </div>

      {/* Additional Actions */}
      <div className="flex justify-center">
        <Button
          onClick={onSaveTranscript}
          className="battle-control-secondary"
          size="sm"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Save Transcript
        </Button>
      </div>
    </div>
  );
};