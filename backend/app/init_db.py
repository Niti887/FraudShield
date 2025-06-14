from models.database import create_tables, engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    try:
        logger.info("Creating database tables...")
        create_tables()
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

if __name__ == "__main__":
    init_db() 