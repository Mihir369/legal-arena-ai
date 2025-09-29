import { cn } from '@/lib/utils';
import judgeImage from '@/assets/judge-character.jpg';

interface JudgeCharacterProps {
  animationState: 'listening' | 'deliberating' | 'announcing' | 'gavel';
  isActive: boolean;
}

export const JudgeCharacter = ({ animationState, isActive }: JudgeCharacterProps) => {
  const getJudgeEffect = () => {
    if (animationState === 'gavel') return 'scale-110 animate-objection-shake';
    if (animationState === 'announcing') return 'scale-105';
    if (isActive) return 'scale-105';
    return 'scale-100';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Judge's Gavel Effect */}
      {animationState === 'gavel' && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="text-2xl font-black text-judge animate-pulse">
            ORDER IN THE COURT!
          </div>
        </div>
      )}

      {/* Judge Image */}
      <div className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-500",
        getJudgeEffect(),
        isActive && "judge-glow"
      )}>
        <img 
          src={judgeImage} 
          alt="Honorable Judge"
          className="w-64 h-40 object-cover"
        />
        
        {/* Active Golden Glow */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent shadow-[inset_0_0_20px_rgba(212,175,55,0.4)]" />
        )}

        {/* Animation State Indicator */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
          {animationState === 'listening' && '👂 Listening'}
          {animationState === 'deliberating' && '⚖️ Deliberating'}
          {animationState === 'announcing' && '📢 Verdict'}
          {animationState === 'gavel' && '🔨 Order!'}
        </div>
      </div>

      {/* Judge Info */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-judge">
          Honorable Judge
        </h3>
        <p className="text-sm text-muted-foreground">
          Presiding Justice
        </p>
      </div>
    </div>
  );
};