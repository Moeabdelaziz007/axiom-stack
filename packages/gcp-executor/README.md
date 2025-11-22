# 🎬 GCP Executor - Bilingual Video Engine

Python execution environment running on Google Cloud Run with advanced video generation capabilities.

---

## 🚀 New Feature: Bilingual Video Generator

Generate professional Short-form videos (Reels/Shorts/TikTok) with:

- **English Hook** (First 3 seconds) - Attention-grabbing
- **Arabic Body** (Remaining 12 seconds) - Value delivery
- **RTL Text Support** - Properly rendered Arabic overlays
- **Zero-Cost Voices** - Microsoft Edge Neural TTS (Free!)

---

## 🎯 Endpoint: `/render-video`

**Method:** `POST`  
**Content-Type:** `application/json`

### Request Body

```json
{
  "script_en": "BITCOIN BREAKS SEVENTY THOUSAND DOLLARS!",
  "script_ar": "البيتكوين يتجاوز حاجز السبعين ألف دولار في تحول تاريخي",
  "pillar": "wins",
  "video_id": "btc_rally_2025"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `script_en` | string | ✅ | English hook text (keep under 10 words) |
| `script_ar` | string | ✅ | Arabic body text (1-2 sentences) |
| `pillar` | string | ❌ | Content category: `wins`, `tech`, or `vision` (default: `wins`) |
| `video_id` | string | ❌ | Custom video ID (auto-generated if not provided) |

### Response

```json
{
  "success": true,
  "video_path": "/tmp/axiom-videos/wins_1705938471_final.mp4",
  "video_id": "wins_1705938471",
  "size_bytes": 2458624
}
```

---

## 🎨 Visual Styling by Pillar

Each pillar has distinctive visual branding:

| Pillar | Background Color | Use Case |
|--------|------------------|----------|
| **wins** | Dark Green (`#1a4d2e`) | Trading profits, market victories |
| **tech** | Dark Blue (`#1e3a8a`) | Code commits, feature releases |
| **vision** | Dark Purple (`#581c87`) | Whitepaper insights, philosophy |

---

## 📦 Dependencies

The video engine uses:

- **edge-tts** - Free neural voice synthesis (Microsoft)
- **Pillow** - Image generation and text rendering
- **arabic-reshaper** - Arabic text shaping
- **python-bidi** - Bidirectional text support (RTL)
- **moviepy** - Video editing (optional, FFmpeg is primary)
- **FFmpeg** - Video encoding and concatenation

---

## 🧪 Testing Locally

### 1. Install Requirements

```bash
pip install -r requirements.txt
```

### 2. Test Video Engine Directly

```bash
python video_engine.py
```

This will generate a test video at `/tmp/axiom-videos/wins_*_final.mp4`

### 3. Test via Flask API

```bash
python app.py
```

Then in another terminal:

```bash
curl -X POST http://localhost:8080/render-video \
  -H "Content-Type: application/json" \
  -d '{
    "script_en": "TEST VIDEO",
    "script_ar": "فيديو تجريبي",
    "pillar": "wins"
  }'
```

---

## 🐳 Deployment (Cloud Run)

### Build Docker Image

```bash
docker build -t gcr.io/your-project/gcp-executor .
docker push gcr.io/your-project/gcp-executor
```

### Deploy to Cloud Run

```bash
gcloud run deploy gcp-executor \
  --image gcr.io/your-project/gcp-executor \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 300s
```

**Note:** Video rendering requires:

- **Memory:** 2GB minimum
- **Timeout:** 5 minutes (FFmpeg processing)

---

## 🔗 Integration with Social Agent

The Social Agent can call this endpoint to generate videos:

```typescript
// In social-agent Worker
const response = await fetch('https://gcp-executor.run.app/render-video', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    script_en: "SOLANA PUMPS 20 PERCENT!",
    script_ar: "سولانا يرتفع 20 بالمئة في يوم واحد",
    pillar: 'wins'
  })
});

const { video_path } = await response.json();

// Upload video to R2/S3
// Post to Instagram/YouTube/TikTok
```

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Video Generation Time | ~15-30 seconds |
| Output Resolution | 1080x1920 (9:16) |
| Output Format | MP4 (H.264) |
| Average File Size | 2-5 MB |
| Audio Quality | 48kHz, Neural TTS |
| Text Rendering | Anti-aliased, Shadow effects |

---

## 🎓 Technical Details

### Audio Pipeline

1. **English Hook:** `en-US-GuyNeural` (Professional male voice)
2. **Arabic Body:** `ar-EG-SalmaNeural` (News anchor female voice)
3. **Format:** MP3, 48kHz, synthesized via Edge TTS

### Text Rendering

1. **Arabic Shaping:** `arabic-reshaper` connects letters
2. **Bidirectional:** `python-bidi` fixes RTL direction
3. **Overlay:** Transparent PNG with shadow effects
4. **Fonts:** System fonts (DejaVu, Liberation, Arial Unicode)

### Video Assembly

1. **Background:** Solid color layer (FFmpeg `color` filter)
2. **Overlay:** Text PNG composited on top
3. **Audio Sync:** Video length matches audio duration
4. **Concatenation:** Hook + Body stitched seamlessly

---

## 🚨 Troubleshooting

### "FFmpeg not found"

Install FFmpeg:

```bash
# Debian/Ubuntu
apt-get update && apt-get install -y ffmpeg

# macOS
brew install ffmpeg
```

### "Arabic text appears backwards"

This is expected in terminal output. The text renders correctly in the video.

### "Font not found"

The engine falls back to default fonts automatically. To use custom fonts:

```python
# In video_engine.py, add to font_paths list
font_paths = [
    "/path/to/your/custom/font.ttf",
    # ... existing paths
]
```

---

## 🎯 Roadmap

- [x] Basic bilingual video generation
- [x] Arabic RTL text support
- [x] Pillar-based color themes
- [ ] Background image/video support (pan/zoom effect)
- [ ] Subtitle tracks (SRT/VTT)
- [ ] Instagram Story format (9:16 with safe zones)
- [ ] YouTube Shorts optimization (hashtag placement)
- [ ] Batch video generation (multiple scripts)

---

**Maintained by:** Axiom ID Core Team  
**License:** Internal Use Only
