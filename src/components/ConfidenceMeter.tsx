import { cn } from '@/lib/utils';

interface ConfidenceMeterProps {
  side: 'prosecution' | 'defense';
  confidence: number; // 0-100
  label: string;
}

export const ConfidenceMeter = ({ side, confidence, label }: ConfidenceMeterProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return 'text-destructive';
    if (confidence < 70) return 'text-amber-400';
    return 'text-primary';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn("text-lg font-bold", getConfidenceColor(confidence))}>
          {confidence}%
        </span>
      </div>
      
      <div className="confidence-meter">
        <div 
          className={cn(
            side === 'prosecution' 
              ? "confidence-bar-prosecution" 
              : "confidence-bar-defense",
            confidence > 80 && "animate-confidence-pulse"
          )}
          style={{ width: `${confidence}%` }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        {confidence < 30 && "Struggling"}
        {confidence >= 30 && confidence < 70 && "Building Case"}
        {confidence >= 70 && confidence < 90 && "Strong Position"}
        {confidence >= 90 && "Commanding Lead"}
      </div>
    </div>
  );
};