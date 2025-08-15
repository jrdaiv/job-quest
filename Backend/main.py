from app import create_app
from app.database.database import database as db
from apscheduler.schedulers.background import BackgroundScheduler

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logging.getLogger().addHandler(logging.StreamHandler())  # Ensure logs go to stdout
logging.info('Flask app started')
print("Flask app starting", flush=True)  # Additional test log

app = create_app()
# Create an instance of the Flask application by calling the create_app function.

# Initialize the scheduler
scheduler = BackgroundScheduler()
scheduler.start()

with app.app_context():
    # Push the application context. This is necessary to perform operations that require the application context, such as interacting with the database.
    
    # db.drop_all()
    # Uncomment this line if you want to drop all tables in the database. This is useful for resetting the database during development.
    db.create_all()
    # Create all tables in the database. This will create the tables based on the models defined in the application.

# import os

# if __name__ == '__main__':
#     port = int(os.environ.get('PORT', 10000))  # use PORT from Render or fallback
#     app.run(debug=True, host='0.0.0.0', port=port)

    # Run the Flask application in debug mode. The debug mode provides detailed error messages and automatically reloads the server when code changes.