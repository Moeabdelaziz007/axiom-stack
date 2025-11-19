import base64
import json
import logging
from flask import Flask, request, jsonify
from google.cloud import pubsub_v1

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
        payload (dict): The analysis task payload containing agent ID, request, etc.
        
    Returns:
        str: Analysis result message
    """
    logger.info(f"Running analysis for agent {payload.get('agent_id', 'unknown')}")
    logger.info(f"Request: {payload.get('request', 'no request data')}")
    
    # Simulate analysis work
    # In a real implementation, this could be complex mathematical computations,
    # data processing, machine learning inference, etc.
    
    return "Analysis Complete"

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
        
        logger.info(f"Received analysis task for agent: {payload.get('agent_id', 'unknown')}")
        
        # Acknowledge the message immediately (Pub/Sub best practice)
        # The actual analysis can run asynchronously
        response = jsonify({'status': 'acknowledged'})
        
        # Run the analysis (in a real implementation, this might be async)
        result = run_analysis(payload)
        logger.info(f"Analysis result: {result}")
        
        return response, 200
        
    except Exception as e:
        logger.error(f"Error processing analysis request: {str(e)}")
        # Still return 200 to avoid Pub/Sub retrying the message
        return jsonify({'status': 'error', 'message': 'Message acknowledged but processing failed'}), 200

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=8080, debug=False)