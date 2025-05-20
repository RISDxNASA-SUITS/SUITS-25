import logging
from api import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    try:
        logger.info("Starting Flask API server...")
        # Run the Flask app
        app.run(
            host='127.0.0.1',  # localhost
            port=4000,
            debug=True  # Enable debug mode for development
        )
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise