"""
Voice Synthesis Module - Multi-language TTS
Using Edge-TTS for zero-cost neural voice generation
"""

import asyncio
import edge_tts
from pathlib import Path
import time
from typing import Optional

class VoiceSynthesizer:
    """
    Generate natural voice audio from text
    Supports multiple languages and voices
    """
    
    # Voice presets
    VOICES = {
        'en_male': 'en-US-GuyNeural',
        'en_female': 'en-US-JennyNeural',
        'ar_male': 'ar-EG-ShakirNeural',
        'ar_female': 'ar-EG-SalmaNeural',
        'en_uk': 'en-GB-RyanNeural',
        'fr_female': 'fr-FR-DeniseNeural',
        'es_male': 'es-ES-AlvaroNeural'
    }
    
    def __init__(self, output_dir: str = "/tmp/axiom-voices"):
        """
        Initialize voice synthesizer
        
        Args:
            output_dir: Directory to save audio files
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def generate_async(
        self,
        text: str,
        voice: str = 'en_male',
        rate: str = '+0%',
        pitch: str = '+0Hz'
    ) -> str:
        """
        Generate voice audio (async)
        
        Args:
            text: Text to convert to speech
            voice: Voice preset key
            rate: Speech rate adjustment (e.g., '+10%', '-20%')
            pitch: Pitch adjustment (e.g., '+5Hz', '-10Hz')
            
        Returns:
            Path to generated MP3 file
        """
        print(f"🎤 Synthesizing voice: {text[:30]}...")
        
        # Get voice ID
        voice_id = self.VOICES.get(voice, self.VOICES['en_male'])
        
        # Generate filename
        timestamp = int(time.time())
        filename = f"voice_{voice}_{timestamp}.mp3"
        output_path = self.output_dir / filename
        
        # Create TTS
        communicate = edge_tts.Communicate(
            text,
            voice_id,
            rate=rate,
            pitch=pitch
        )
        
        # Save audio
        await communicate.save(str(output_path))
        
        print(f"✅ Voice saved: {output_path}")
        return str(output_path)
    
    def generate(
        self,
        text: str,
        voice: str = 'en_male',
        rate: str = '+0%',
        pitch: str = '+0Hz'
    ) -> str:
        """
        Generate voice audio (sync wrapper)
        
        Args:
            text: Text to convert to speech
            voice: Voice preset key
            rate: Speech rate adjustment
            pitch: Pitch adjustment
            
        Returns:
            Path to generated MP3 file
        """
        # Run async function in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(
                self.generate_async(text, voice, rate, pitch)
            )
        finally:
            loop.close()
    
    def get_audio_duration(self, audio_path: str) -> float:
        """
        Get duration of audio file in seconds
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Duration in seconds
        """
        try:
            from moviepy.editor import AudioFileClip
            audio = AudioFileClip(audio_path)
            duration = audio.duration
            audio.close()
            return duration
        except Exception as e:
            print(f"⚠️ Could not get duration: {e}")
            return 0.0


# Example usage
if __name__ == "__main__":
    synthesizer = VoiceSynthesizer()
    
    # Test 1: English male voice
    print("\nTest 1: English Male")
    audio_path = synthesizer.generate(
        text="Bitcoin has just broken the seventy thousand dollar barrier!",
        voice='en_male'
    )
    duration = synthesizer.get_audio_duration(audio_path)
    print(f"Audio: {audio_path}")
    print(f"Duration: {duration:.2f}s")
    
    # Test 2: Arabic female voice
    print("\nTest 2: Arabic Female")
    audio_path = synthesizer.generate(
        text="البيتكوين يتجاوز حاجز السبعين ألف دولار",
        voice='ar_female'
    )
    print(f"Audio: {audio_path}")
