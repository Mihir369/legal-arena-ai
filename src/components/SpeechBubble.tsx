import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpeechBubbleProps {
  text: string;
  side: 'prosecution' | 'defense';
  isVisible: boolean;
  onComplete?: () => void;
}

export const SpeechBubble = ({ text, side, isVisible, onComplete }: SpeechBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible || !text) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Typing speed

      return () => clearTimeout(timer);
    } else if (onComplete) {
      const completeTimer = setTimeout(onComplete, 2000); // Hold for 2 seconds
      return () => clearTimeout(completeTimer);
    }
  }, [currentIndex, text, isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "animate-speech-appear relative max-w-md mx-4 z-10",
        side === 'prosecution' 
          ? "speech-bubble-prosecution ml-8" 
          : "speech-bubble-defense mr-8"
      )}
    >
      {/* Speech bubble tail */}
      <div 
        className={cn(
          "absolute top-6 w-0 h-0",
          side === 'prosecution' 
            ? "-left-3 border-l-0 border-r-[12px] border-t-[8px] border-b-[8px] border-r-prosecution/30 border-t-transparent border-b-transparent"
            : "-right-3 border-r-0 border-l-[12px] border-t-[8px] border-b-[8px] border-l-defense/30 border-t-transparent border-b-transparent"
        )}
      />
      
      <div className="text-foreground leading-relaxed">
        {displayedText}
        {currentIndex < text.length && (
          <span className="animate-pulse text-primary">|</span>
        )}
      </div>
    </div>
  );
};