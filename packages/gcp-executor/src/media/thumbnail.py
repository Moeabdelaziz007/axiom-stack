"""
Thumbnail Creation Module - Professional YouTube/Instagram Thumbnails
Using Pillow for text overlays and visual effects
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from pathlib import Path
import time
from typing import Tuple, Optional

class ThumbnailMaker:
    """
    Create professional thumbnails with text overlays
    """
    
    # Standard thumbnail sizes
    SIZES = {
        "youtube": (1280, 720),    # 16:9
        "instagram": (1080, 1080),  # 1:1
        "twitter": (1200, 675)      # 16:9
    }
    
    def __init__(self, output_dir: str = "/tmp/axiom-thumbnails"):
        """
        Initialize thumbnail maker
        
        Args:
            output_dir: Directory to save thumbnails
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def create_thumbnail(
        self,
        background_path: str,
        title: str,
        platform: str = "youtube",
        text_color: str = "white",
        shadow_color: str = "black",
        overlay_opacity: int = 100
    ) -> str:
        """
        Create thumbnail with text overlay
        
        Args:
            background_path: Path to background image
            title: Main title text
            platform: Target platform (youtube, instagram, twitter)
            text_color: Color of main text
            shadow_color: Color of text shadow
            overlay_opacity: Opacity of dark overlay (0-255)
            
        Returns:
            Path to created thumbnail
        """
        print(f"🖼️ Creating thumbnail: {title[:30]}...")
        
        # Load and resize background
        bg_image = Image.open(background_path)
        target_size = self.SIZES.get(platform, self.SIZES["youtube"])
        bg_image = bg_image.resize(target_size, Image.Resampling.LANCZOS)
        
        # Apply slight blur for depth
        bg_image = bg_image.filter(ImageFilter.GaussianBlur(radius=1))
        
        # Darken image slightly for better text contrast
        enhancer = ImageEnhance.Brightness(bg_image)
        bg_image = enhancer.enhance(0.7)
        
        # Create semi-transparent overlay
        overlay = Image.new('RGBA', target_size, (0, 0, 0, overlay_opacity))
        bg_image = bg_image.convert('RGBA')
        bg_image = Image.alpha_composite(bg_image, overlay)
        
        # Setup drawing
        draw = ImageDraw.Draw(bg_image)
        
        # Load font (try multiple paths)
        font_size = 100 if platform == "youtube" else 80
        font = self._load_font(font_size)
        
        # Calculate text position (center)
        bbox = draw.textbbox((0, 0), title, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (target_size[0] - text_width) / 2
        y = (target_size[1] - text_height) / 2
        
        # Draw text shadow (multiple layers for depth)
        shadow_offset = 6
        for i in range(3):
            offset = shadow_offset - i * 2
            draw.text(
                (x + offset, y + offset),
                title,
                font=font,
                fill=shadow_color
            )
        
        # Draw main text
        draw.text((x, y), title, font=font, fill=text_color)
        
        # Save thumbnail
        timestamp = int(time.time())
        filename = f"thumbnail_{platform}_{timestamp}.png"
        output_path = self.output_dir / filename
        
        # Convert back to RGB before saving
        final_image = bg_image.convert('RGB')
        final_image.save(output_path, quality=95)
        
        print(f"✅ Thumbnail saved: {output_path}")
        return str(output_path)
    
    def create_youtube_thumbnail(
        self,
        background_path: str,
        title: str,
        subtitle: Optional[str] = None
    ) -> str:
        """
        Create YouTube-optimized thumbnail with title and optional subtitle
        
        Args:
            background_path: Path to background image
            title: Main title (big text)
            subtitle: Optional smaller text below title
            
        Returns:
            Path to created thumbnail
        """
        print(f"🎬 Creating YouTube thumbnail...")
        
        # Load and resize
        bg_image = Image.open(background_path)
        bg_image = bg_image.resize(self.SIZES["youtube"], Image.Resampling.LANCZOS)
        
        # Darken
        enhancer = ImageEnhance.Brightness(bg_image)
        bg_image = enhancer.enhance(0.6)
        
        # Add gradient overlay (darker at bottom)
        overlay = self._create_gradient_overlay(self.SIZES["youtube"])
        bg_image = bg_image.convert('RGBA')
        bg_image = Image.alpha_composite(bg_image, overlay)
        
        draw = ImageDraw.Draw(bg_image)
        
        # Main title
        title_font = self._load_font(120)
        
        # Center title
        bbox = draw.textbbox((0, 0), title, font=title_font)
        text_width = bbox[2] - bbox[0]
        title_x = (1280 - text_width) / 2
        title_y = 250 if subtitle else 300
        
        # Shadow + main text
        for offset in range(8, 0, -2):
            draw.text(
                (title_x + offset, title_y + offset),
                title,
                font=title_font,
                fill='black'
            )
        
        draw.text((title_x, title_y), title, font=title_font, fill='white')
        
        # Subtitle if provided
        if subtitle:
            subtitle_font = self._load_font(60)
            bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            sub_width = bbox[2] - bbox[0]
            sub_x = (1280 - sub_width) / 2
            sub_y = 420
            
            draw.text((sub_x + 4, sub_y + 4), subtitle, font=subtitle_font, fill='black')
            draw.text((sub_x, sub_y), subtitle, font=subtitle_font, fill='#FFD700')  # Gold
        
        # Save
        timestamp = int(time.time())
        output_path = self.output_dir / f"yt_thumb_{timestamp}.png"
        bg_image.convert('RGB').save(output_path, quality=95)
        
        print(f"✅ YouTube thumbnail: {output_path}")
        return str(output_path)
    
    def _load_font(self, size: int) -> ImageFont.FreeTypeFont:
        """Load font with fallback options"""
        font_paths = [
            "/System/Library/Fonts/Supplemental/Impact.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
        ]
        
        for path in font_paths:
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
        
        # Fallback to default
        return ImageFont.load_default()
    
    def _create_gradient_overlay(self, size: Tuple[int, int]) -> Image.Image:
        """Create gradient overlay (transparent top, dark bottom)"""
        overlay = Image.new('RGBA', size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Draw gradient rectangles
        for y in range(size[1]):
            alpha = int((y / size[1]) * 180)  # 0 to 180
            draw.rectangle(
                [(0, y), (size[0], y + 1)],
                fill=(0, 0, 0, alpha)
            )
        
        return overlay


# Example usage
if __name__ == "__main__":
    from images import ImageFactory
    
    # Generate background first
    image_factory = ImageFactory()
    bg_path = image_factory.generate_background("cryptocurrency explosion", aspect_ratio="16:9")
    
    # Create thumbnail
    thumbnail_maker = ThumbnailMaker()
    
    # YouTube thumbnail
    thumb_path = thumbnail_maker.create_youtube_thumbnail(
        background_path=bg_path,
        title="BITCOIN HITS $70K!",
        subtitle="Market Analysis Inside"
    )
    
    print(f"\n🎉 Thumbnail ready: {thumb_path}")
