// components/useWakeWord.ts - Wake word detection hook
import { useState, useEffect, useCallback } from 'react';

export interface WakeWordHook {
  isWakeWordDetected: boolean;
  detectWakeWord: (transcript: string) => boolean;
  resetWakeWord: () => void;
}

interface WakeWordOptions {
  wakeWords?: string[];
  sensitivity?: number; // 0-1, where 1 is exact match
}

const useWakeWord = (options: WakeWordOptions = {}): WakeWordHook => {
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);
  
  const defaultOptions = {
    wakeWords: ['hey axiom', 'hi axiom', 'axiom'],
    sensitivity: 0.8,
    ...options
  };

  const detectWakeWord = useCallback((transcript: string): boolean => {
    if (!transcript) return false;
    
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Exact match check
    for (const wakeWord of defaultOptions.wakeWords) {
      if (lowerTranscript.includes(wakeWord)) {
        setIsWakeWordDetected(true);
        return true;
      }
    }
    
    // Fuzzy match for better detection
    if (defaultOptions.sensitivity < 1) {
      for (const wakeWord of defaultOptions.wakeWords) {
        const distance = levenshteinDistance(lowerTranscript, wakeWord);
        const maxLength = Math.max(lowerTranscript.length, wakeWord.length);
        const similarity = 1 - (distance / maxLength);
        
        if (similarity >= defaultOptions.sensitivity) {
          setIsWakeWordDetected(true);
          return true;
        }
      }
    }
    
    return false;
  }, [defaultOptions]);

  const resetWakeWord = useCallback(() => {
    setIsWakeWordDetected(false);
  }, []);

  // Levenshtein distance algorithm for fuzzy string matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1, // deletion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  return {
    isWakeWordDetected,
    detectWakeWord,
    resetWakeWord
  };
};

export default useWakeWord;