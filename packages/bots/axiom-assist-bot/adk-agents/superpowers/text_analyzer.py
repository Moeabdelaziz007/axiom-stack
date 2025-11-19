from .base_power import BaseSuperpower
import re


class TextAnalyzerPower(BaseSuperpower):
    """Superpower for text analysis and natural language processing."""
    
    def get_name(self) -> str:
        return "text_analysis"
    
    async def execute(self, payload: dict) -> dict:
        """Execute text analysis on the provided text.
        
        Args:
            payload: Dictionary containing 'text' key with the text to analyze
            
        Returns:
            Dictionary containing the analysis results
        """
        text = payload.get('text')
        if not text:
            return {"error": "Text is required for analysis"}
        
        # Perform basic text analysis
        word_count = len(text.split())
        char_count = len(text)
        sentence_count = len(re.split(r'[.!?]+', text)) - 1
        paragraph_count = len(text.split('\n\n'))
        
        # Simple keyword extraction (words longer than 4 characters)
        words = re.findall(r'\b[a-zA-Z]{5,}\b', text.lower())
        keyword_freq: dict[str, int] = {}
        for word in words:
            keyword_freq[word] = keyword_freq.get(word, 0) + 1
        
        # Get top 5 keywords
        top_keywords = sorted(keyword_freq.items(), 
                              key=lambda x: x[1], 
                              reverse=True)[:5]
        
        return {
            "status": "success",
            "analysis": {
                "word_count": word_count,
                "character_count": char_count,
                "sentence_count": sentence_count,
                "paragraph_count": paragraph_count,
                "top_keywords": [
                    {"word": kw[0], "frequency": kw[1]} 
                    for kw in top_keywords
                ]
            }
        }