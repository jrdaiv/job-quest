from app.database.database import database as db
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from app.config.config import Config as cf
from app.database import models as m
import logging
from datetime import datetime, date

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

# Function to send signup confirmation email
def send_signup_email(user_email, user_name):
    message = Mail(
        from_email='questjobs24@gmail.com',
        to_emails=user_email,
        subject='Welcome to Job Quest!',
        html_content=f"""
        <p>Hi {user_name},</p>
        <p>Welcome to Job Quest! We’re excited to help you grow your network and land your dream job.</p>
        <p>Best regards,<br/>The Job Quest Team</p>
        """
    )
    try:
        sg = SendGridAPIClient(cf.SENDGRID_API_KEY)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(f"Error: {str(e)}")

# Reminder email function
def send_reminder_email(user_email, user_name, date_applied, reminder_date, company_name, position, hiring_manager_name=None, recruiter_name=None):
# Convert date_applied to string if it's a datetime.date object
    if isinstance(date_applied, date):
        date_applied = date_applied.strftime('%Y-%m-%d')
    
    applied_date_obj = datetime.strptime(date_applied, '%Y-%m-%d').date()
    reminder_date_obj = datetime.strptime(reminder_date, '%Y-%m-%d').date() if isinstance(reminder_date, str) else reminder_date

    # Calculate the difference in days
    days_difference = (reminder_date_obj - applied_date_obj).days


    # Construct the email content
    hiring_manager_text = f" with the hiring manager {hiring_manager_name}" if hiring_manager_name else ""
    recruiter_text = f" or recruiter {recruiter_name}" if recruiter_name else ""
    
    email_content = f"""
    <p>Hi {user_name},</p>
    <p>It's been {days_difference} days since you applied for {company_name}'s position {position}.</p>
    <p>Please follow up{hiring_manager_text}{recruiter_text} now.</p>
    <p>If you are stuck, please refer to Quests 5 and 6 from the Job Quest app.</p>
    <p>Good luck with your follow ups and hope you get that interview!</p>
    <p>Best regards,<br/>The Job Quest Team!</p>
    """

    message = Mail(
        from_email='questjobs24@gmail.com',
        to_emails=user_email,
        subject='Reminder: Follow Up on Your Job Quest!',
        html_content=email_content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        logger.info(f'Email sent to {user_email} with status code {response.status_code}')
        logger.info(f'Response body: {response.body}')
        logger.info(f'Response headers: {response.headers}')
    except Exception as e:
        logger.error(f"Error sending email to {user_email}: {str(e)}")