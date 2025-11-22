import base64
import json
import logging
import io
import contextlib
import asyncio
import os
from flask import Flask, request, jsonify
from video_engine import VideoEngine

# Import media modules
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from media.images import ImageFactory
from media.thumbnail import ThumbnailMaker
from media.voice import VoiceSynthesizer


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)


def run_analysis(payload):
    """
    Placeholder function for complex analysis.
    In a real implementation, this would perform the actual analysis.
    
    Args:
        payload (dict): The analysis task payload containing agent ID, request,
                        etc.
        
    Returns:
        str: Analysis result message
    """
    agent_id = payload.get('agent_id', 'unknown')
    logger.info("Running analysis for agent {}".format(agent_id))
    
    request_data = payload.get('request', 'no request data')
    logger.info("Request: {}".format(request_data))
    
    # Simulate analysis work
    # In a real implementation, this could be complex mathematical
    # computations, data processing, machine learning inference, etc.
    
    return "Analysis Complete"


def execute_python_code(code, args=None):
    """
    Execute Python code in a restricted environment.
    
    Args:
        code (str): Python code to execute
        args (list): Arguments to pass to the code
        
    Returns:
        dict: Execution result with stdout, stderr, and success status
    """
    logger.info("Executing Python code")
    
    # Capture stdout and stderr
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    # Create a restricted global environment
    restricted_globals = {
        '__builtins__': {
            'print': print,
            'len': len,
            'range': range,
            'enumerate': enumerate,
            'zip': zip,
            'sorted': sorted,
            'sum': sum,
            'min': min,
            'max': max,
            'abs': abs,
            'round': round,
            'int': int,
            'float': float,
            'str': str,
            'bool': bool,
            'list': list,
            'dict': dict,
            'tuple': tuple,
            'set': set,
            'frozenset': frozenset,
            'type': type,
            'isinstance': isinstance,
            'issubclass': issubclass,
            'Exception': Exception,
            'ValueError': ValueError,
            'TypeError': TypeError,
            'KeyError': KeyError,
            'IndexError': IndexError,
            'AttributeError': AttributeError,
            'ImportError': ImportError,
            'None': None,
            'True': True,
            'False': False,
        },
        # Import commonly used libraries if available
        'json': __import__('json'),
    }
    
    # Try to import optional libraries
    try:
        restricted_globals['math'] = __import__('math')
    except ImportError:
        pass
        
    try:
        restricted_globals['numpy'] = __import__('numpy')
    except ImportError:
        pass
        
    try:
        restricted_globals['pandas'] = __import__('pandas')
    except ImportError:
        pass
    
    # Add args to locals if provided
    local_vars = {}
    if args:
        local_vars['args'] = args
    
    try:
        # Execute code with captured output
        with contextlib.redirect_stdout(stdout_capture):
            with contextlib.redirect_stderr(stderr_capture):
                exec(code, restricted_globals, local_vars)
        
        stdout_result = stdout_capture.getvalue()
        stderr_result = stderr_capture.getvalue()
        
        return {
            'success': True,
            'stdout': stdout_result,
            'stderr': stderr_result,
            'result': local_vars.get('result', None)
        }
    except Exception as e:
        stderr_result = stderr_capture.getvalue()
        return {
            'success': False,
            'stdout': stdout_capture.getvalue(),
            'stderr': stderr_result + str(e),
            'error': str(e)
        }


@app.route('/', methods=['GET'])
def health_check():
    """
    Health check endpoint for Cloud Run service.
    
    Returns:
        JSON response with service status
    """
    return jsonify({
        'status': 'healthy',
        'service': 'axiom-gcp-executor',
        'version': '1.0.0'
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Main analysis endpoint that handles Pub/Sub push messages.
    
    Expected Pub/Sub push payload format:
    {
        "message": {
            "data": "base64-encoded-payload",
            "messageId": "unique-message-id",
            "publishTime": "timestamp"
        },
        "subscription": "subscription-name"
    }
    
    Returns:
        HTTP 200 OK to acknowledge message receipt
    """
    try:
        # Get the Pub/Sub message
        envelope = request.get_json()
        
        if not envelope:
            logger.error("No Pub/Sub message received")
            return jsonify({'error': 'No Pub/Sub message received'}), 400
            
        if 'message' not in envelope:
            logger.error("Invalid Pub/Sub message format")
            return jsonify({'error': 'Invalid Pub/Sub message format'}), 400
            
        # Extract the message
        message = envelope['message']
        
        if 'data' not in message:
            logger.error("No data in Pub/Sub message")
            return jsonify({'error': 'No data in Pub/Sub message'}), 400
            
        # Decode the Base64 payload
        payload_data = base64.b64decode(message['data']).decode('utf-8')
        payload = json.loads(payload_data)
        
        agent_id = payload.get('agent_id', 'unknown')
        logger.info("Received analysis task for agent: {}".format(agent_id))
        
        # Acknowledge the message immediately (Pub/Sub best practice)
        # The actual analysis can run asynchronously
        response = jsonify({'status': 'acknowledged'})
        
        # Run the analysis (in a real implementation, this might be async)
        result = run_analysis(payload)
        logger.info("Analysis result: {}".format(result))
        
        return response, 200
        
    except Exception as e:
        logger.error("Error processing analysis request: {}".format(str(e)))
        # Still return 200 to avoid Pub/Sub retrying the message
        return jsonify({'status': 'error',
                        'message': 'Message acknowledged but processing failed'
                        }), 200


@app.route('/execute', methods=['POST'])
def execute():
    """
    Execute Python code endpoint.
    
    Expected payload format:
    {
        "code": "print('Hello, World!')",
        "args": [1, 2, 3]
    }
    
    Returns:
        JSON response with execution results
    """
    try:
        # Get the execution request
        payload = request.get_json()
        
        if not payload:
            logger.error("No execution payload received")
            return jsonify({'error': 'No execution payload received'}), 400
            
        if 'code' not in payload:
            logger.error("No code in execution payload")
            return jsonify({'error': 'No code in execution payload'}), 400
            
        code = payload['code']
        args = payload.get('args', [])
        
        logger.info("Executing Python code: {}".format(code[:100]))
        
        # Execute the code
        result = execute_python_code(code, args)
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error("Error executing Python code: {}".format(str(e)))
        return jsonify({'error': str(e)}), 500


@app.route('/render-video', methods=['POST'])
def render_video():
    """
    Render bilingual video (English Hook + Arabic Body)
    
    Expected JSON payload:
    {
        "script_en": "BITCOIN HITS SEVENTY THOUSAND!",
        "script_ar": "البيتكوين يتجاوز السبعين ألف دولار",
        "pillar": "wins",  # or "tech" or "vision"
        "video_id": "optional_custom_id"
    }
    
    Returns:
    {
        "success": true,
        "video_path": "/tmp/axiom-videos/wins_1234567890_final.mp4",
        "video_id": "wins_1234567890"
    }
    """
    try:
        payload = request.json
        
        script_en = payload.get('script_en')
        script_ar = payload.get('script_ar')
        pillar = payload.get('pillar', 'wins')
        video_id = payload.get('video_id')
        
        if not script_en or not script_ar:
            return jsonify({'error': 'Both script_en and script_ar are required'}), 400
        
        logger.info(f"🎬 Video render request: pillar={pillar}")
        logger.info(f"   EN: {script_en[:50]}...")
        logger.info(f"   AR: {script_ar[:50]}...")
        
        # Initialize video engine
        engine = VideoEngine()
        
        # Run async video creation in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            video_path = loop.run_until_complete(
                engine.create_reel(script_en, script_ar, pillar, video_id)
            )
        finally:
            loop.close()
        
        logger.info(f"✅ Video rendered successfully: {video_path}")
        
        # Extract video_id from path
        import os
        actual_video_id = os.path.basename(video_path).replace('_final.mp4', '')
        
        return jsonify({
            'success': True,
            'video_path': video_path,
            'video_id': actual_video_id,
            'size_bytes': os.path.getsize(video_path) if os.path.exists(video_path) else 0
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Error rendering video: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/media/image', methods=['POST'])
def generate_image():
    """
    Generate AI image using Pollinations.AI
    
    Request body:
    {
        "prompt": "futuristic cryptocurrency chart",
        "width": 1280,
        "height": 720,
        "style": "photorealistic"
    }
    """
    try:
        payload = request.json
        
        prompt = payload.get('prompt')
        width = payload.get('width', 1280)
        height = payload.get('height', 720)
        style = payload.get('style', 'photorealistic')
        
        if not prompt:
            return jsonify({'error': 'prompt is required'}), 400
        
        logger.info(f"🎨 Image generation: {prompt[:50]}...")
        
        # Generate image
        factory = ImageFactory()
        image_path = factory.generate_image(
            prompt=prompt,
            width=width,
            height=height,
            style=style
        )
        
        # Get file size
        file_size = os.path.getsize(image_path)
        
        return jsonify({
            'success': True,
            'path': image_path,
            'size_bytes': file_size,
            'dimensions': f"{width}x{height}"
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Image generation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/media/voice', methods=['POST'])
def generate_voice():
    """
    Generate voice audio from text
    
    Request body:
    {
        "text": "Bitcoin hits seventy thousand!",
        "voice": "en_male",
        "rate": "+0%",
        "pitch": "+0Hz"
    }
    """
    try:
        payload = request.json
        
        text = payload.get('text')
        voice = payload.get('voice', 'en_male')
        rate = payload.get('rate', '+0%')
        pitch = payload.get('pitch', '+0Hz')
        
        if not text:
            return jsonify({'error': 'text is required'}), 400
        
        logger.info(f"🎤 Voice synthesis: {text[:30]}...")
        
        # Generate voice
        synthesizer = VoiceSynthesizer()
        audio_path = synthesizer.generate(
            text=text,
            voice=voice,
            rate=rate,
            pitch=pitch
        )
        
        # Get duration
        duration = synthesizer.get_audio_duration(audio_path)
        file_size = os.path.getsize(audio_path)
        
        return jsonify({
            'success': True,
            'path': audio_path,
            'duration_seconds': round(duration, 2),
            'size_bytes': file_size,
            'voice': voice
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Voice generation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/media/thumbnail', methods=['POST'])
def create_thumbnail():
    """
    Create thumbnail with text overlay
    
    Request body:
    {
        "title": "BITCOIN BREAKS $70K!",
        "background_prompt": "cryptocurrency explosion green candles",
        "platform": "youtube",
        "subtitle": "Market Analysis"
    }
    """
    try:
        payload = request.json
        
        title = payload.get('title')
        background_prompt = payload.get('background_prompt')
        platform = payload.get('platform', 'youtube')
        subtitle = payload.get('subtitle')
        
        if not title:
            return jsonify({'error': 'title is required'}), 400
        
        logger.info(f"🖼️ Thumbnail creation: {title[:30]}...")
        
        # Generate or use existing background
        if background_prompt:
            factory = ImageFactory()
            bg_path = factory.generate_background(background_prompt, aspect_ratio="16:9")
        else:
            return jsonify({'error': 'background_prompt is required'}), 400
        
        # Create thumbnail
        maker = ThumbnailMaker()
        
        if subtitle:
            thumb_path = maker.create_youtube_thumbnail(
                background_path=bg_path,
                title=title,
                subtitle=subtitle
            )
        else:
            thumb_path = maker.create_thumbnail(
                background_path=bg_path,
                title=title,
                platform=platform
            )
        
        file_size = os.path.getsize(thumb_path)
        
        return jsonify({
            'success': True,
            'path': thumb_path,
            'size_bytes': file_size,
            'platform': platform
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Thumbnail creation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=8080, debug=False)