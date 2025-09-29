import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VoiceControlPanelProps {
  enabled: boolean;
  volume: number;
  speed: number;
  isSpeaking: boolean;
  isSupported: boolean;
  onToggleEnabled: () => void;
  onVolumeChange: (volume: number) => void;
  onSpeedChange: (speed: number) => void;
}

export const VoiceControlPanel = ({
  enabled,
  volume,
  speed,
  isSpeaking,
  isSupported,
  onToggleEnabled,
  onVolumeChange,
  onSpeedChange
}: VoiceControlPanelProps) => {
  if (!isSupported) {
    return (
      <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MicOff className="w-4 h-4" />
          <span>Voice not supported in this browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg space-y-4 min-w-[200px]">
      {/* Voice Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Voice</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleEnabled}
          className={cn(
            "w-16",
            enabled ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-red-500/10 border-red-500/20 text-red-600"
          )}
        >
          {enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 text-xs">
        <div className={cn(
          "w-2 h-2 rounded-full",
          enabled && isSpeaking ? "bg-green-500 animate-pulse" : enabled ? "bg-green-500" : "bg-red-500"
        )} />
        <span className="text-muted-foreground">
          {enabled ? (isSpeaking ? "Voice Active" : "Voice Ready") : "Voice Muted"}
        </span>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Volume</span>
          <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          {volume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-muted-foreground" />}
          <Slider
            value={[volume * 100]}
            onValueChange={(value) => onVolumeChange(value[0] / 100)}
            max={100}
            step={5}
            className="flex-1"
          />
        </div>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Speed</span>
          <span className="text-xs text-muted-foreground">{speed}x</span>
        </div>
        <div className="flex space-x-1">
          {[0.8, 1.0, 1.2].map((speedOption) => (
            <Button
              key={speedOption}
              variant={speed === speedOption ? "default" : "outline"}
              size="sm"
              onClick={() => onSpeedChange(speedOption)}
              className="flex-1 text-xs"
            >
              {speedOption === 0.8 ? "Slow" : speedOption === 1.0 ? "Normal" : "Fast"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};