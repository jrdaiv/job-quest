from flask import Flask
from flask_login import LoginManager  # Manage user sessions and login/logout state
from flask_jwt_extended import JWTManager  # Handle JWT-based authentication
from flask_cors import CORS  # Enable Cross-Origin Resource Sharing
from app.config.config import Config as cf  # Load configuration values
from app.database.database import database as db  # Import the SQLAlchemy database instance
from app.config.caching import cache  # Import cache instance (like Flask-Caching)
from app.database.models.schemas import ma  # Import Marshmallow for data serialization

# Initialize Flask extensions (but not bound to app yet)
login_manager = LoginManager()
jwt = JWTManager()

def create_app():
    # Create and configure the Flask application instance
    app = Flask(__name__)
    
    # Enable CORS for all routes and origins (public access)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Load configuration settings from the custom config class
    app.config.from_object(cf)

    # Set the secret key used for encoding JWTs
    app.config["JWT_SECRET_KEY"] = cf.JWT_SECRET_KEY

    # Initialize and bind extensions to the Flask app
    db.init_app(app)              # Set up SQLAlchemy database connection
    login_manager.init_app(app)   # Set up Flask-Login
    jwt.init_app(app)             # Set up JWT for token-based auth
    cache.init_app(app)           # Set up caching (optional, for performance)
    ma.init_app(app)              # Set up Marshmallow for schema serialization

    # Import database models to register them with SQLAlchemy
    from app.database import models as md

    # Import and register route blueprints (modular route files)
    from app.routes import quests, jobs, follow_ups, hiring_managers, recruiters, users, auth

    app.register_blueprint(quests.app)           # Register quests routes
    # app.register_blueprint(missions.app)       # Example: missions routes (commented out)
    # app.register_blueprint(instructions.app)   # Example: instructions routes (commented out)
    # app.register_blueprint(tips.app)           # Example: tips routes (commented out)
    app.register_blueprint(jobs.app)             # Register jobs routes
    app.register_blueprint(follow_ups.app)       # Register follow-up routes
    app.register_blueprint(hiring_managers.app)  # Register hiring manager routes
    app.register_blueprint(recruiters.app)       # Register recruiter routes
    app.register_blueprint(users.app)            # Register user routes
    app.register_blueprint(auth.app)             # Register authentication routes

    # Automatically create all tables in the connected MySQL database
    with app.app_context():
        db.create_all()  # Creates tables based on imported models if they don't exist

    # Return the configured Flask application
    return app
