import { useState, useCallback, useRef } from 'react';

interface SpeechSettings {
  enabled: boolean;
  volume: number;
  speed: number;
}

interface SpeechState {
  isSpeaking: boolean;
  currentSpeaker: 'prosecution' | 'defense' | null;
  currentText: string;
}

export const useSpeech = () => {
  const [settings, setSettings] = useState<SpeechSettings>({
    enabled: true,
    volume: 0.8,
    speed: 1.0
  });

  const [speechState, setSpeechState] = useState<SpeechState>({
    isSpeaking: false,
    currentSpeaker: null,
    currentText: ''
  });

  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, attorneyType: 'prosecution' | 'defense') => {
    if (!settings.enabled || !window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (attorneyType === 'prosecution') {
      utterance.pitch = 0.9;
      utterance.rate = settings.speed;
      utterance.volume = settings.volume;
    } else {
      utterance.pitch = 1.2;
      utterance.rate = settings.speed * 1.1;
      utterance.volume = settings.volume;
    }

    utterance.onstart = () => {
      setSpeechState({
        isSpeaking: true,
        currentSpeaker: attorneyType,
        currentText: text
      });
    };

    utterance.onend = () => {
      setSpeechState({
        isSpeaking: false,
        currentSpeaker: null,
        currentText: ''
      });
    };

    utterance.onerror = () => {
      setSpeechState({
        isSpeaking: false,
        currentSpeaker: null,
        currentText: ''
      });
    };

    currentUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [settings]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeechState({
      isSpeaking: false,
      currentSpeaker: null,
      currentText: ''
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SpeechSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return {
    settings,
    speechState,
    speak,
    pause,
    resume,
    stop,
    updateSettings,
    isSupported
  };
};