import { useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttorneyCharacter } from '@/components/AttorneyCharacter';
import { JudgeCharacter } from '@/components/JudgeCharacter';
import { SpeechBubble } from '@/components/SpeechBubble';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { EvidenceStack } from '@/components/EvidenceCard';
import { BattleControls } from '@/components/BattleControls';
import { VoiceControlPanel } from '@/components/VoiceControlPanel';
import { useSpeech } from '@/hooks/useSpeech';
import prosecutionImage from '@/assets/prosecution-attorney.jpg';
import defenseImage from '@/assets/defense-attorney.jpg';

interface BattleState {
  isActive: boolean;
  currentSpeaker: 'prosecution' | 'defense' | 'judge' | null;
  prosecutionConfidence: number;
  defenseConfidence: number;
  battleProgress: number;
  currentArgument: string;
  round: number;
  isComplete: boolean;
  winner: 'prosecution' | 'defense' | 'tie' | null;
}

interface Evidence {
  id: string;
  title: string;
  type: 'document' | 'precedent' | 'testimony';
  side: 'prosecution' | 'defense';
  strength: number;
}

const mockArguments = {
  prosecution: [
    "Your Honor, she said that she loves cold showers, not that she had a cold shower. If she had a cold shower, she would have said so!",
    "That is an unrelated hypothetical to the dilemma at hand. To engage with such would be to engage with a fallacy!",
    "Are you claiming my client is a liar?",
    "My client has already stated that she bathed in hot water and then bathed in cold water. You failed to consider that both could be the case, yet didn't hesitate to say she's above deceptive imagery, looking wildly unprofessional.",
    "You fail to consider the possibility that she took a hot shower, disliked it, and then took a cold shower to make up for it, thus only enjoying the cold shower.",
    "Where is it stated that she knew that she disliked hot showers? Not only is that information trivial, it's also ignoring the possibility that she wanted to try out a hot shower to see if she still disliked hot showers.",
    "That's... not how it works! Cold water doesn't unfog mirrors that way!",
  ],
  defense: [
    "Your Honor, even if she does enjoy cold showers, would it not be contradictory for me to say 'I love mustard' and then show a picture of a bottle of ketchup?",
    "You can't object on the grounds of relevancy here. The principle of both situations is the same. I'm just illustrating the situation to prove that it's deceptive.",
    "I'm simply saying one can see in Exhibit A that she is not above attaching deceptive imagery to her statements. Let the record reflect that YOU brought up the word 'liar.'",
    "At no point did she imply that she bathed in hot water. Her statement only implies that her water transitioned from hot to cold. I must say, no shower control system I've ever encountered starts on hot and moves to cold.",
    "If she knows that she loves cold showers, why on earth would she start with a hot shower? There's no way she'd wait the time required for the water to heat up if she knew she disliked hot showers!",
    "If it was hot then cold, wouldn't the cold water have unfogged the mirror? Yes it would! The cold would have caused the condensation to evaporate!",
  ],
  judge: [
    "*GAVEL STRIKE* Order! Order in the court!",
    "That is enough. The prosecution has a point, but neither side has enough evidence to support their claims.",
    "This trial shall be postponed until sufficient evidence has been gathered. Court is adjourned!",
  ],
};

const mockEvidence: Evidence[] = [
  { id: '1', title: 'Original Contract Document', type: 'document', side: 'prosecution', strength: 4 },
  { id: '2', title: 'Email Communications', type: 'document', side: 'prosecution', strength: 3 },
  { id: '3', title: 'Force Majeure Precedent', type: 'precedent', side: 'defense', strength: 5 },
  { id: '4', title: 'Client Testimony', type: 'testimony', side: 'defense', strength: 4 },
  { id: '5', title: 'Financial Loss Report', type: 'document', side: 'prosecution', strength: 5 },
  { id: '6', title: 'Industry Standards', type: 'precedent', side: 'defense', strength: 3 }
];

export const BattleArena = () => {
  const [battleState, setBattleState] = useState<BattleState>({
    isActive: false,
    currentSpeaker: null,
    prosecutionConfidence: 50,
    defenseConfidence: 50,
    battleProgress: 0,
    currentArgument: '',
    round: 0,
    isComplete: false,
    winner: null
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [argumentIndex, setArgumentIndex] = useState(0);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  
  const { 
    settings: voiceSettings, 
    speechState, 
    speak, 
    pause: pauseSpeech, 
    resume: resumeSpeech, 
    stop: stopSpeech,
    updateSettings: updateVoiceSettings,
    isSupported: isVoiceSupported
  } = useSpeech();

  const prosecutionEvidence = mockEvidence.filter(e => e.side === 'prosecution');
  const defenseEvidence = mockEvidence.filter(e => e.side === 'defense');

  const startBattle = useCallback(() => {
    if (!documentUploaded) return;
    
    setBattleState(prev => ({
      ...prev,
      isActive: true,
      currentSpeaker: 'prosecution',
      currentArgument: mockArguments.prosecution[0] || '',
      round: 1
    }));
    setIsPlaying(true);
    setArgumentIndex(0);
  }, [documentUploaded]);

  // Handle speech when argument changes
  useEffect(() => {
    if (battleState.currentArgument && battleState.currentSpeaker && voiceSettings.enabled) {
      const speaker = battleState.currentSpeaker as 'prosecution' | 'defense';
      if (speaker === 'prosecution' || speaker === 'defense') {
        speak(battleState.currentArgument, speaker);
      }
    }
  }, [battleState.currentArgument, battleState.currentSpeaker, voiceSettings.enabled, speak]);

  const nextArgument = useCallback(() => {
    if (!isPlaying || battleState.isComplete) return;

    const currentSide = battleState.currentSpeaker as 'prosecution' | 'defense';
    const nextSide = currentSide === 'prosecution' ? 'defense' : 'prosecution';
    const nextArgumentIndex = battleState.currentSpeaker === 'prosecution' ? argumentIndex : argumentIndex + 1;
    
    if (nextArgumentIndex >= mockArguments.prosecution.length) {
      // Battle complete - judge gives verdict
      setBattleState(prev => ({
        ...prev,
        currentSpeaker: 'judge',
        currentArgument: "After careful deliberation, I have reached my verdict...",
        isComplete: true,
        winner: prev.prosecutionConfidence > prev.defenseConfidence ? 'prosecution' : 'defense',
        battleProgress: 100
      }));
      return;
    }

    const nextArgument = nextSide === 'prosecution' 
      ? mockArguments.prosecution[nextArgumentIndex]
      : mockArguments.defense[nextArgumentIndex];

    setBattleState(prev => ({
      ...prev,
      currentSpeaker: nextSide,
      currentArgument: nextArgument,
      prosecutionConfidence: Math.min(100, prev.prosecutionConfidence + (Math.random() - 0.4) * 20),
      defenseConfidence: Math.min(100, prev.defenseConfidence + (Math.random() - 0.4) * 20),
      battleProgress: Math.min(100, (nextArgumentIndex / mockArguments.prosecution.length) * 100),
      round: nextSide === 'prosecution' ? prev.round + 1 : prev.round
    }));

    if (battleState.currentSpeaker === 'defense') {
      setArgumentIndex(nextArgumentIndex);
    }
  }, [isPlaying, battleState, argumentIndex]);

  useEffect(() => {
    if (isPlaying && battleState.isActive && !battleState.isComplete) {
      const timer = setTimeout(nextArgument, 4000 / speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, battleState.isActive, battleState.isComplete, nextArgument, speed]);

  const getAnimationState = (character: 'prosecution' | 'defense' | 'judge') => {
    if (battleState.currentSpeaker === character) {
      if (battleState.currentArgument.includes('Objection')) return 'objecting';
      return 'speaking';
    }
    if (battleState.isComplete && battleState.winner === character) return 'celebrating';
    if (battleState.isActive) return 'thinking';
    return 'idle';
  };

  const handleFileUpload = () => {
    setDocumentUploaded(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setBattleState({
      isActive: false,
      currentSpeaker: null,
      prosecutionConfidence: 50,
      defenseConfidence: 50,
      battleProgress: 0,
      currentArgument: '',
      round: 0,
      isComplete: false,
      winner: null
    });
    setIsPlaying(false);
    setArgumentIndex(0);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Courtroom Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            ⚖️ AI Legal Battle Arena
          </h1>
          <p className="text-muted-foreground">
            Watch AI attorneys debate your case in real-time
          </p>
        </div>

        {!documentUploaded ? (
          /* Document Upload Section */
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Legal Document</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a contract, case file, or legal document to start the battle
              </p>
              <Button onClick={handleFileUpload} className="battle-control-primary">
                Select Document
              </Button>
            </div>
          </div>
        ) : (
          /* Battle Arena */
          <div className="space-y-8">
            {/* Judge Section */}
            <div className="flex justify-center">
              <JudgeCharacter 
                animationState={getAnimationState('judge') as any}
                isActive={battleState.currentSpeaker === 'judge'}
              />
            </div>

            {/* Main Battle Arena */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Prosecution Side */}
              <div className="space-y-6">
                <AttorneyCharacter
                  side="prosecution"
                  image={prosecutionImage}
                  name="Arjun Sharma"
                  isActive={battleState.currentSpeaker === 'prosecution'}
                  isSpeaking={speechState.isSpeaking && speechState.currentSpeaker === 'prosecution'}
                  animationState={getAnimationState('prosecution')}
                />
                
                <ConfidenceMeter
                  side="prosecution"
                  confidence={Math.round(battleState.prosecutionConfidence)}
                  label="Prosecution Confidence"
                />

                <EvidenceStack 
                  evidence={prosecutionEvidence}
                  side="prosecution"
                />
              </div>

              {/* Center Battle Status */}
              <div className="space-y-6">
                {/* Round Counter */}
                {battleState.isActive && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      Round {battleState.round}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {battleState.isComplete ? 'Battle Complete' : 'In Progress'}
                    </div>
                  </div>
                )}

                {/* Speech Bubble */}
                {battleState.currentArgument && (
                  <div className="flex justify-center">
                    <SpeechBubble
                      text={battleState.currentArgument}
                      side={battleState.currentSpeaker as 'prosecution' | 'defense'}
                      isVisible={!!battleState.currentArgument}
                      isSpeaking={speechState.isSpeaking && speechState.currentSpeaker === battleState.currentSpeaker}
                      onPauseSpeech={pauseSpeech}
                      onResumeSpeech={resumeSpeech}
                      onReplaySpeech={() => {
                        if (battleState.currentSpeaker && battleState.currentArgument) {
                          speak(battleState.currentArgument, battleState.currentSpeaker as 'prosecution' | 'defense');
                        }
                      }}
                    />
                  </div>
                )}

                {/* Battle Controls */}
                <BattleControls
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onRestart={handleRestart}
                  onSpeedChange={setSpeed}
                  onSaveTranscript={() => {}}
                  currentSpeed={speed}
                  battleProgress={battleState.battleProgress}
                />

                {/* Start Battle Button */}
                {!battleState.isActive && (
                  <div className="text-center">
                    <Button
                      onClick={startBattle}
                      className="battle-control-primary"
                      size="lg"
                    >
                      ⚔️ Start Legal Battle
                    </Button>
                  </div>
                )}

                {/* Winner Announcement */}
                {battleState.isComplete && battleState.winner && (
                  <div className="text-center space-y-4 p-6 bg-card border border-border rounded-lg">
                    <h3 className="text-2xl font-bold text-primary">
                      🎉 Victory!
                    </h3>
                    <p className="text-lg">
                      The <span className={battleState.winner === 'prosecution' ? 'text-prosecution' : 'text-defense'}>
                        {battleState.winner}
                      </span> wins the case!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Final confidence: {battleState.winner === 'prosecution' 
                        ? Math.round(battleState.prosecutionConfidence)
                        : Math.round(battleState.defenseConfidence)
                      }%
                    </p>
                  </div>
                )}
              </div>

              {/* Defense Side */}
              <div className="space-y-6">
                <AttorneyCharacter
                  side="defense"
                  image={defenseImage}
                  name="Priya Singh"
                  isActive={battleState.currentSpeaker === 'defense'}
                  isSpeaking={speechState.isSpeaking && speechState.currentSpeaker === 'defense'}
                  animationState={getAnimationState('defense')}
                />
                
                <ConfidenceMeter
                  side="defense"
                  confidence={Math.round(battleState.defenseConfidence)}
                  label="Defense Confidence"
                />

                <EvidenceStack 
                  evidence={defenseEvidence}
                  side="defense"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Control Panel */}
      <VoiceControlPanel
        enabled={voiceSettings.enabled}
        volume={voiceSettings.volume}
        speed={voiceSettings.speed}
        isSpeaking={speechState.isSpeaking}
        isSupported={isVoiceSupported}
        onToggleEnabled={() => updateVoiceSettings({ enabled: !voiceSettings.enabled })}
        onVolumeChange={(volume) => updateVoiceSettings({ volume })}
        onSpeedChange={(speed) => updateVoiceSettings({ speed })}
      />
    </div>
  );
};
