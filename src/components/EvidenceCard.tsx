import { cn } from '@/lib/utils';
import { FileText, Scale, Clock } from 'lucide-react';

interface Evidence {
  id: string;
  title: string;
  type: 'document' | 'precedent' | 'testimony';
  side: 'prosecution' | 'defense';
  strength: number; // 1-5
}

interface EvidenceCardProps {
  evidence: Evidence;
  isAnimating?: boolean;
}

export const EvidenceCard = ({ evidence, isAnimating = false }: EvidenceCardProps) => {
  const getEvidenceIcon = () => {
    switch (evidence.type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'precedent': return <Scale className="w-4 h-4" />;
      case 'testimony': return <Clock className="w-4 h-4" />;
    }
  };

  const getStrengthColor = () => {
    if (evidence.strength <= 2) return 'text-destructive';
    if (evidence.strength <= 3) return 'text-amber-400';
    return 'text-primary';
  };

  return (
    <div className={cn(
      "evidence-card",
      isAnimating && "animate-evidence-slide",
      evidence.side === 'prosecution' 
        ? "border-prosecution/30 bg-gradient-to-br from-prosecution/10 to-transparent" 
        : "border-defense/30 bg-gradient-to-br from-defense/10 to-transparent"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn(
          "flex items-center space-x-2",
          evidence.side === 'prosecution' ? "text-prosecution" : "text-defense"
        )}>
          {getEvidenceIcon()}
          <span className="text-xs font-medium uppercase tracking-wide">
            {evidence.type}
          </span>
        </div>
        
        <div className="flex space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < evidence.strength ? getStrengthColor() : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
      
      <h4 className="text-sm font-semibold text-foreground leading-tight">
        {evidence.title}
      </h4>
    </div>
  );
};

interface EvidenceStackProps {
  evidence: Evidence[];
  side: 'prosecution' | 'defense';
  maxVisible?: number;
}

export const EvidenceStack = ({ evidence, side, maxVisible = 3 }: EvidenceStackProps) => {
  const visibleEvidence = evidence.slice(0, maxVisible);
  const remainingCount = evidence.length - maxVisible;

  return (
    <div className="space-y-2">
      <h3 className={cn(
        "text-sm font-bold text-center uppercase tracking-wide",
        side === 'prosecution' ? "text-prosecution" : "text-defense"
      )}>
        Evidence ({evidence.length})
      </h3>
      
      <div className="space-y-2">
        {visibleEvidence.map((item, index) => (
          <EvidenceCard 
            key={item.id} 
            evidence={item}
            isAnimating={index === 0} // Animate newest evidence
          />
        ))}
        
        {remainingCount > 0 && (
          <div className="text-center text-xs text-muted-foreground py-2 border border-dashed border-muted rounded">
            +{remainingCount} more evidence
          </div>
        )}
      </div>
    </div>
  );
};