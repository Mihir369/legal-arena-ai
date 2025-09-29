import { useState, useEffect } from 'react';
import { Waveform } from '@/components/Waveform';
import { cn } from '@/lib/utils';

interface AttorneyCharacterProps {
  side: 'prosecution' | 'defense';
  image: string;
  name: string;
  isActive: boolean;
  isSpeaking?: boolean;
  animationState: 'idle' | 'speaking' | 'objecting' | 'thinking' | 'celebrating';
}

export const AttorneyCharacter = ({ 
  side, 
  image, 
  name, 
  isActive, 
  isSpeaking = false,
  animationState 
}: AttorneyCharacterProps) => {
  const [showObjection, setShowObjection] = useState(false);

  useEffect(() => {
    if (animationState === 'objecting') {
      setShowObjection(true);
      const timer = setTimeout(() => setShowObjection(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  const getCharacterEffect = () => {
    if (animationState === 'objecting') return 'scale-110 animate-objection-shake';
    if (animationState === 'celebrating') return 'scale-105';
    if (isSpeaking) return 'scale-105 shadow-[0_0_30px_rgba(212,175,55,0.6)]';
    if (isActive) return 'scale-105';
    return 'scale-100';
  };

  const getGlowEffect = () => {
    if (!isActive) return '';
    return side === 'prosecution' ? 'attorney-glow-prosecution' : 'attorney-glow-defense';
  };

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Objection Animation */}
      {showObjection && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="objection-burst">
            OBJECTION!
          </div>
        </div>
      )}

      {/* Character Image */}
      <div className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-500",
        getCharacterEffect(),
        getGlowEffect()
      )}>
        <img 
          src={image} 
          alt={`${name} - ${side} attorney`}
          className={cn(
            "w-48 h-72 object-cover transition-all duration-200",
            isSpeaking && animationState === 'speaking' && "animate-mouth-speak"
          )}
        />
        
        {/* Active Indicator */}
        {isActive && (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-transparent to-transparent",
            side === 'prosecution' 
              ? "shadow-[inset_0_0_20px_rgba(220,20,60,0.3)]"
              : "shadow-[inset_0_0_20px_rgba(30,58,138,0.3)]"
          )} />
        )}

        {/* Speaking Waveform */}
        {isSpeaking && animationState === 'speaking' && (
          <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
            <Waveform isActive={isSpeaking} side={side} size="sm" />
          </div>
        )}

        {/* Animation State Indicator */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
          {isSpeaking && animationState === 'speaking' && '🎤 Speaking'}
          {!isSpeaking && animationState === 'speaking' && '💬 Ready'}
          {animationState === 'objecting' && '⚡ Objecting'}
          {animationState === 'thinking' && '🤔 Thinking'}
          {animationState === 'celebrating' && '🎉 Victory'}
          {animationState === 'idle' && '⏸️ Ready'}
        </div>
      </div>

      {/* Character Info */}
      <div className="text-center space-y-1">
        <h3 className={cn(
          "text-lg font-bold",
          side === 'prosecution' ? "text-prosecution" : "text-defense"
        )}>
          {name}
        </h3>
        <p className="text-sm text-muted-foreground capitalize">
          {side} Attorney
        </p>
      </div>
    </div>
  );
};