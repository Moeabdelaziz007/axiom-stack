"""
video_engine.py - Bilingual Video Generator for Axiom ID Social Media
Generates Short-form videos (Reels/Shorts/TikTok) with:
- English Hook (First 3 seconds)
- Arabic Body (Remaining 12 seconds)
- Professional text overlays with RTL support
"""

import os
import asyncio
import subprocess
from pathlib import Path
from typing import Tuple, Optional
import edge_tts
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

# Video Configuration
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920  # 9:16 Shorts format
FPS = 30

# Voice Configuration (Microsoft Edge Neural Voices - Free!)
VOICE_EN = "en-US-GuyNeural"  # Professional male voice
VOICE_AR = "ar-EG-SalmaNeural"  # Clear female news anchor voice

class VideoEngine:
    """
    Bilingual Video Generator
    Combines English audio hook + Arabic audio body + visual overlays
    """
    
    def __init__(self, output_dir: str = "/tmp/axiom-videos"):
        """
        Initialize video engine
        
        Args:
            output_dir: Directory for temporary and output files
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    async def generate_audio(
        self, 
        text: str, 
        voice: str, 
        output_path: str
    ) -> str:
        """
        Generate speech audio using Edge TTS
        
        Args:
            text: Text to convert to speech
            voice: Voice ID (e.g., 'en-US-GuyNeural')
            output_path: Where to save the MP3
            
        Returns:
            Path to generated audio file
        """
        print(f"🎤 Synthesizing ({voice}): {text[:30]}...")
        
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        
        print(f"✅ Audio saved: {output_path}")
        return output_path
    
    def fix_arabic_text(self, text: str) -> str:
        """
        Fix Arabic text for proper rendering in images/videos
        
        Without this, Arabic appears backwards and disconnected.
        Example: 'م ح م د' instead of 'محمد'
        
        Args:
            text: Raw Arabic text
            
        Returns:
            Properly shaped and bidirectional text
        """
        reshaped = arabic_reshaper.reshape(text)
        bidi_text = get_display(reshaped)
        return bidi_text
    
    def create_text_overlay(
        self, 
        text: str, 
        output_path: str,
        lang: str = 'en',
        font_size: int = 100
    ) -> str:
        """
        Create transparent PNG with centered text
        
        Args:
            text: Text to render
            output_path: Where to save PNG
            lang: Language ('en' or 'ar')
            font_size: Size of font in pixels
            
        Returns:
            Path to created overlay image
        """
        print(f"🖼️ Creating overlay: {text[:20]}...")
        
        # Create transparent canvas
        img = Image.new('RGBA', (VIDEO_WIDTH, VIDEO_HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Load appropriate font
        try:
            if lang == 'ar':
                # Use system Arabic font or fallback
                font_paths = [
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
                    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
                ]
                font = None
                for font_path in font_paths:
                    if os.path.exists(font_path):
                        font = ImageFont.truetype(font_path, font_size)
                        break
                if not font:
                    font = ImageFont.load_default()
            else:
                # English: Use Impact-style bold font
                font_paths = [
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                    "/System/Library/Fonts/Supplemental/Impact.ttf",
                ]
                font = None
                for font_path in font_paths:
                    if os.path.exists(font_path):
                        font = ImageFont.truetype(font_path, font_size)
                        break
                if not font:
                    font = ImageFont.load_default()
        except Exception as e:
            print(f"⚠️ Font loading error: {e}. Using default.")
            font = ImageFont.load_default()
        
        # Calculate text position (center)
        try:
            bbox = draw.textbbox((0, 0), text, font=font)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
        except:
            # Fallback for older Pillow versions
            text_w, text_h = draw.textsize(text, font=font)
        
        x = (VIDEO_WIDTH - text_w) / 2
        y = (VIDEO_HEIGHT - text_h) / 2
        
        # Draw text with shadow for readability
        shadow_color = "black"
        text_color = "white" if lang == 'en' else "#00F0FF"  # Cyan for Arabic
        
        # Shadow offset
        draw.text((x + 5, y + 5), text, font=font, fill=shadow_color)
        # Main text
        draw.text((x, y), text, font=font, fill=text_color)
        
        img.save(output_path)
        print(f"✅ Overlay saved: {output_path}")
        return output_path
    
    def create_video_clip(
        self,
        audio_path: str,
        overlay_path: str,
        background_color: str,
        output_path: str
    ) -> str:
        """
        Use FFmpeg to combine audio + background + text overlay
        
        Args:
            audio_path: Path to audio MP3
            overlay_path: Path to text overlay PNG
            background_color: Hex color (e.g., '0x330000')
            output_path: Where to save output MP4
            
        Returns:
            Path to generated video clip
        """
        print(f"🎬 Rendering clip: {output_path}...")
        
        # FFmpeg command
        # Input 0: Solid color background
        # Input 1: Text overlay PNG
        # Input 2: Audio
        cmd = [
            'ffmpeg', '-y',
            '-f', 'lavfi', '-i', f'color=c={background_color}:s={VIDEO_WIDTH}x{VIDEO_HEIGHT}:r={FPS}',
            '-i', overlay_path,
            '-i', audio_path,
            '-filter_complex', '[0:v][1:v]overlay=0:0:shortest=1[v]',
            '-map', '[v]', '-map', '2:a',
            '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
            '-shortest',  # Stop when audio ends
            output_path
        ]
        
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT, check=True)
        print(f"✅ Clip rendered: {output_path}")
        return output_path
    
    def concatenate_videos(
        self,
        clip1_path: str,
        clip2_path: str,
        output_path: str
    ) -> str:
        """
        Stitch two video clips together
        
        Args:
            clip1_path: First clip (Hook)
            clip2_path: Second clip (Body)
            output_path: Final output video
            
        Returns:
            Path to final video
        """
        print("🔗 Stitching final video...")
        
        # Create concat list file
        concat_file = self.output_dir / "concat_list.txt"
        with open(concat_file, 'w') as f:
            f.write(f"file '{clip1_path}'\n")
            f.write(f"file '{clip2_path}'\n")
        
        cmd = [
            'ffmpeg', '-y',
            '-f', 'concat', '-safe', '0', '-i', str(concat_file),
            '-c', 'copy',
            output_path
        ]
        
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT, check=True)
        print(f"🚀 FINAL VIDEO: {output_path}")
        return output_path
    
    async def create_reel(
        self,
        script_en: str,
        script_ar: str,
        pillar: str = 'wins',
        video_id: Optional[str] = None
    ) -> str:
        """
        Main method: Create complete bilingual Reel video
        
        Args:
            script_en: English hook text (3 seconds)
            script_ar: Arabic body text (12 seconds)
            pillar: Content pillar ('wins', 'tech', or 'vision')
            video_id: Optional custom ID for the video
            
        Returns:
            Path to final video file
        """
        if not video_id:
            import time
            video_id = f"{pillar}_{int(time.time())}"
        
        print(f"\n{'='*50}")
        print(f"🎬 Creating Bilingual Reel: {video_id}")
        print(f"{'='*50}\n")
        
        # Choose background colors based on pillar
        bg_colors = {
            'wins': '0x1a4d2e',   # Dark green (money/profit)
            'tech': '0x1e3a8a',   # Dark blue (technology)
            'vision': '0x581c87'  # Dark purple (future/vision)
        }
        
        hook_bg = bg_colors.get(pillar, '0x1a1a1a')
        body_bg = '0x0a0a0a'  # Very dark for body
        
        # Step 1: Generate Audio Files
        hook_audio = str(self.output_dir / f"{video_id}_hook.mp3")
        body_audio = str(self.output_dir / f"{video_id}_body.mp3")
        
        await self.generate_audio(script_en, VOICE_EN, hook_audio)
        await self.generate_audio(script_ar, VOICE_AR, body_audio)
        
        # Step 2: Fix Arabic text for rendering
        script_ar_fixed = self.fix_arabic_text(script_ar)
        
        # Step 3: Create Text Overlays
        hook_overlay = str(self.output_dir / f"{video_id}_hook_overlay.png")
        body_overlay = str(self.output_dir / f"{video_id}_body_overlay.png")
        
        self.create_text_overlay(script_en, hook_overlay, lang='en', font_size=120)
        self.create_text_overlay(script_ar_fixed, body_overlay, lang='ar', font_size=80)
        
        # Step 4: Render Individual Clips
        hook_clip = str(self.output_dir / f"{video_id}_hook_clip.mp4")
        body_clip = str(self.output_dir / f"{video_id}_body_clip.mp4")
        
        self.create_video_clip(hook_audio, hook_overlay, hook_bg, hook_clip)
        self.create_video_clip(body_audio, body_overlay, body_bg, body_clip)
        
        # Step 5: Stitch Together
        final_video = str(self.output_dir / f"{video_id}_final.mp4")
        self.concatenate_videos(hook_clip, body_clip, final_video)
        
        print(f"\n✅ SUCCESS! Video ready: {final_video}\n")
        return final_video


# Example Usage (for testing)
if __name__ == "__main__":
    async def test():
        engine = VideoEngine()
        
        script_en = "BITCOIN BREAKING SEVENTY THOUSAND DOLLARS!"
        script_ar = "البيتكوين يتجاوز حاجز السبعين ألف دولار في تحول تاريخي للأسواق"
        
        video_path = await engine.create_reel(script_en, script_ar, pillar='wins')
        print(f"📹 Test video created: {video_path}")
    
    asyncio.run(test())
