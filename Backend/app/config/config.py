import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_NAME = os.getenv("DB_NAME")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    # SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    CACHE_TYPE = "SimpleCache"