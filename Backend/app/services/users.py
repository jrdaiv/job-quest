from flask import Flask, request, jsonify
from app.database.database import database as db
from app.database import models as m
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.emails import send_signup_email, send_reminder_email
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

def create_user(user_info):

    existing_user = m.User.query.filter_by(email=user_info['email'].lower()).first()
    if existing_user:
        raise ValueError('You have already registered, please sign in')
    new_user = m.User(
        name=user_info['name'].capitalize(),        
        email=user_info['email'].lower(),
        password=generate_password_hash(user_info['password']),
    )
    db.session.add(new_user)
    db.session.commit()

    # Send the signup email after the user is created
    # send_signup_email(new_user.email, new_user.name)

     # Schedule the reminder email for 7 days later
    # reminder_time = datetime.now() + timedelta(minutes=2)
    # send_reminder_email(new_user.email, new_user.name, reminder_time)

    return new_user

def get_all():    
    all_users = m.User.query.all()
    return [user.serialize() for user in all_users]

def get_by_id(user_id):
    user = m.User.query.get_or_404(user_id)
    return user.serialize()

def update_user(user_id, new_info):
    user = m.User.query.get_or_404(user_id)
    if 'name' in new_info:
        user.name = new_info['name']
    if 'email' in new_info:
        user.email = new_info['email']
    if 'password' in new_info:
        user.password = new_info['password']

    try:
        db.session.commit()
        return {'message': 'User updated succesfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500

def delete(user_id):
    user = m.User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return {'message': 'User deleted succesfully'}