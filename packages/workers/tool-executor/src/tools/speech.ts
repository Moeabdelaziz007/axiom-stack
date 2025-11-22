// packages/workers/tool-executor/src/tools/speech.ts - Speech-to-Text Integration for Tool Executor

// Define types for Speech API responses
interface SpeechRecognitionResponse {
  results: Array<{
    alternatives: Array<{
      transcript: string;
      confidence: number;
    }>;
    resultEndTime: string;
    languageCode: string;
  }>;
  totalBilledTime: string;
}

export class SpeechClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Transcribe audio from base64 string
   * @param audioBase64 - Base64 encoded audio data
   * @returns Promise<string> - Transcribed text
   */
  async transcribe(audioBase64: string): Promise<string> {
    {
      method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
          alternativeLanguageCodes: ['es-ES', 'fr-FR'],
          maxAlternatives: 1,
          profanityFilter: false,
          speechContexts: [],
          enableWordTimeOffsets: false,
          enableWordConfidence: false,
          enableAutomaticPunctuation: true,
          enableSpeakerDiarization: false,
          model: 'command_and_search', // Optimized for short commands
          useEnhanced: true
        },
        audio: {
          content: audioData
        }
      })
    }
      );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Speech API error: ${errorText}`);
    }

    const result: SpeechRecognitionResponse = await response.json();

    if (result.results && result.results.length > 0 && result.results[0].alternatives && result.results[0].alternatives.length > 0) {
      return result.results[0].alternatives[0].transcript;
    }

    return ''; // Return empty string if no transcription
  } catch(error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}
}