import { cn } from '@/lib/utils';

interface WaveformProps {
  isActive: boolean;
  side: 'prosecution' | 'defense';
  size?: 'sm' | 'md';
}

export const Waveform = ({ isActive, side, size = 'md' }: WaveformProps) => {
  const barCount = 4;
  const sizeClasses = size === 'sm' ? 'w-1 h-2' : 'w-1 h-4';
  
  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-full transition-all duration-200",
            sizeClasses,
            isActive && "animate-wave",
            side === 'prosecution' ? "bg-prosecution" : "bg-defense"
          )}
          style={{
            animationDelay: isActive ? `${index * 0.1}s` : '0s'
          }}
        />
      ))}
    </div>
  );
};