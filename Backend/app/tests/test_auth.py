# import unittest
# from flask import Flask, jsonify
# from flask_jwt_extended import JWTManager
# from flask.testing import FlaskClient
# from app import create_app
# from app.database import models as m
# from app.database.database import database as db  # Import the SQLAlchemy instance
# from unittest.mock import patch
# from werkzeug.security import generate_password_hash, check_password_hash

# class AuthTestCase(unittest.TestCase):
#     def setUp(self):
#         app = create_app()
#         app.config['TESTING'] = True
#         self.app = app
#         self.client = app.test_client()
#         self.app_context = app.app_context()
#         self.app_context.push()

#         with self.app.app_context():
#             db.create_all()

#     def tearDown(self):
#         self.app_context.pop()

#     @patch('app.database.models.User.query.filter_by')
#     def test_login_success(self, mock_filter_by):
#         mock_user = m.User(id=1, name='Nicolas', email='nr115935@gmail.com', password=generate_password_hash('password'), change_password=False)
#         mock_filter_by.return_value.first.return_value = mock_user

#         response = self.client.post('/api/auth/login', json={
#             'email': 'nr115935@gmail.com',            
#             'password': 'password'
#         })

#         self.assertEqual(response.status_code, 200)
#         self.assertIn('access_token', response.json)

#     def test_login_missing_fields(self):
#         response = self.client.post('/api/auth/login', json={})
#         self.assertEqual(response.status_code, 400)
#         self.assertEqual(response.json['message'], "Email and password are required")

#     @patch('app.database.models.User.query.filter_by')
#     def test_login_invalid_credentials(self, mock_filter_by):
#         mock_filter_by.return_value.first.return_value = None

#         response = self.client.post('/api/auth/login', json={
#             'email': 'wrong@example.com',
#             'password': 'wrongpassword'
#         })

#         self.assertEqual(response.status_code, 401)
#         self.assertEqual(response.json['message'], "Invalid email or password")

# if __name__ == '__main__':
#     unittest.main()