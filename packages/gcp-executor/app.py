import base64
import json
import logging
import io
import contextlib
from flask import Flask, request, jsonify


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


if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=8080, debug=False)