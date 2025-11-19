// Gemini API interfaces and types

export interface GeminiPayload {
  contents: Array<{
    role: string;
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }>;
  system_instruction?: {
    parts: Array<{
      text: string;
    }>;
  };
  tools?: Array<{
    google_search?: {};
  }>;
  generation_config?: {
    response_mime_type?: string;
    temperature?: number;
  };
  safety_settings?: Array<{
    category: string;
    threshold: string;
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string;
        inline_data?: any;
      }>;
    };
    citationMetadata?: {
      citations: Array<{
        startIndex: number;
        endIndex: number;
        uri: string;
        title: string;
        license: string;
        publicationDate: {
          year: number;
          month: number;
          day: number;
        };
      }>;
    };
  }>;
  groundingMetadata?: {
    webSearchQueries: string[];
    searchEntryPoint: {
      renderedContent: string;
    };
  };
}

export interface AIResponse {
  text: string;
  citations: Array<{ uri: string; title: string }>;
  searchQueries: string[];
  confidence?: number;
}