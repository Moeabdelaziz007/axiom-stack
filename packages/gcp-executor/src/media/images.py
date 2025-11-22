"""
Image Generation Module - Pollinations.AI Integration
Zero-cost AI image generation for social media content
"""

import urllib.parse
import requests
from pathlib import Path
import time
from typing import Optional

class ImageFactory:
    """
    Generate AI images using Pollinations.AI (100% free, no API key needed)
    """
    
    BASE_URL = "https://image.pollinations.ai/prompt"
    
    def __init__(self, output_dir: str = "/tmp/axiom-images"):
        """
        Initialize image factory
        
        Args:
            output_dir: Directory to save generated images
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_image(
        self, 
        prompt: str,
        width: int = 1280,
        height: int = 720,
        style: str = "photorealistic",
        seed: Optional[int] = None
    ) -> str:
        """
        Generate an AI image from prompt
        
        Args:
            prompt: Text description of desired image
            width: Image width in pixels
            height: Image height in pixels
            style: Art style (photorealistic, anime, digital-art, abstract)
            seed: Optional seed for reproducible results
            
        Returns:
            Path to downloaded image file
        """
        print(f"🎨 Generating image: {prompt[:50]}...")
        
        # Construct Pollinations URL
        encoded_prompt = urllib.parse.quote(prompt)
        url = f"{self.BASE_URL}/{encoded_prompt}"
        
        # Add parameters
        params = {
            "width": width,
            "height": height,
            "model": style,
            "nologo": "true"
        }
        
        if seed:
            params["seed"] = seed
        
        # Build full URL
        param_str = "&".join([f"{k}={v}" for k, v in params.items()])
        full_url = f"{url}?{param_str}"
        
        # Download image
        response = requests.get(full_url, timeout=30)
        response.raise_for_status()
        
        # Save to file
        timestamp = int(time.time())
        filename = f"ai_image_{timestamp}.png"
        output_path = self.output_dir / filename
        
        output_path.write_bytes(response.content)
        
        print(f"✅ Image saved: {output_path}")
        return str(output_path)
    
    def generate_background(
        self, 
        theme: str,
        aspect_ratio: str = "16:9"
    ) -> str:
        """
        Generate a background image optimized for video/social media
        
        Args:
            theme: Theme/topic (e.g., 'crypto', 'tech', 'space')
            aspect_ratio: '16:9' for YouTube, '9:16' for Shorts/Reels
            
        Returns:
            Path to generated background image
        """
        # Map aspect ratio to dimensions
        dimensions = {
            "16:9": (1920, 1080),
            "9:16": (1080, 1920),
            "1:1": (1080, 1080)
        }
        
        width, height = dimensions.get(aspect_ratio, (1920, 1080))
        
        # Enhanced prompt for better backgrounds
        prompt = f"abstract {theme} background, vibrant colors, professional, high quality, no text"
        
        return self.generate_image(
            prompt=prompt,
            width=width,
            height=height,
            style="digital-art"
        )


# Example usage
if __name__ == "__main__":
    factory = ImageFactory()
    
    # Test 1: Generate crypto-themed background
    print("\nTest 1: Crypto Background")
    bg_path = factory.generate_background("cryptocurrency bitcoin", aspect_ratio="16:9")
    print(f"Background: {bg_path}")
    
    # Test 2: Generate custom image
    print("\nTest 2: Custom Image")
    img_path = factory.generate_image(
        prompt="futuristic AI robot trading stocks, cyberpunk style",
        width=1280,
        height=720,
        style="digital-art"
    )
    print(f"Custom Image: {img_path}")
