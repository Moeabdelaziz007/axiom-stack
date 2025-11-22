// packages/workers/tool-executor/src/tools/translate.ts - Translation Integration for Tool Executor

// Define types for Translation API responses
interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage: string;
    }>;
  };
}

interface DetectionResponse {
  data: {
    detections: Array<Array<{
      language: string;
      confidence: number;
    }>>;
  };
}

export class TranslationClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Translate text to target language
   * @param text - Text to translate
   * @param targetLang - Target language code (e.g., 'es', 'fr', 'de')
   * @returns Promise<{translatedText: string, detectedSourceLanguage: string}> - Translation result
   */
  async translateText(text: string, targetLang: string): Promise<{translatedText: string, detectedSourceLanguage: string}> {
    try {
      // First, detect the source language
      const detectedLanguage = await this.detectLanguage(text);
      
      // Then translate the text
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            format: 'text'
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Translation API error: ${errorText}`);
      }
      
      const result: TranslationResponse = await response.json();
      
      if (result.data && result.data.translations && result.data.translations.length > 0) {
        return {
          translatedText: result.data.translations[0].translatedText,
          detectedSourceLanguage: result.data.translations[0].detectedSourceLanguage || detectedLanguage
        };
      }
      
      throw new Error('No translation result returned');
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }

  /**
   * Detect language of text
   * @param text - Text to analyze
   * @returns Promise<string> - Detected language code
   */
  private async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            q: text
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Detection API error: ${errorText}`);
      }
      
      const result: DetectionResponse = await response.json();
      
      if (result.data && result.data.detections && result.data.detections.length > 0 && result.data.detections[0].length > 0) {
        return result.data.detections[0][0].language;
      }
      
      return 'en'; // Default to English if detection fails
    } catch (error) {
      console.warn('Error detecting language:', error);
      return 'en'; // Default to English if detection fails
    }
  }
}