# Job Quest Application

## Overview
Job Quest is a comprehensive job application management platform designed to streamline the job search process. It allows users to manage job applications, set reminders for follow-ups, and receive email notifications. The platform includes both a backend API built with Flask and a frontend built with React.

---

### Testing Credentials

For testing purposes, you may use the following credentials to access the website:

- **Email:** `testingjobquest@gmail.com`
- **Password:** `JobQuest24!`


## Features

### Backend:
- **User Management:** Register, update, and delete users.
- **Job Management:** Create, update, and delete job applications.
- **Follow-Ups:** Schedule and manage follow-up reminders for job applications.
- **Email Notifications:** Send signup confirmation and follow-up reminder emails.
- **Caching:** Cache frequently accessed data to improve performance.
- **JWT Authentication:** Secure user authentication using JSON Web Tokens.

### Frontend:
- **User Interface:** Intuitive UI for managing job applications and follow-ups.
- **Forms:** User-friendly forms for login, signup, and job application management.
- **Notifications:** Real-time notifications for follow-up reminders.

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm 6+

### Installation

#### 1. Clone the repository:
```bash
git clone https://github.com/your-repo/job-quest.git
cd job-quest
```

#### 2. Backend Setup:
Navigate to the backend directory:
```bash
cd Backend
```

#### Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

#### Install the required packages:

```bash
pip install -r requirements.txt
```

#### Create a .env file in the Backend directory and add the following environment variables:

```env
DB_NAME=your_db_name
JWT_SECRET_KEY=your_jwt_secret_key
DATABASE_URL=your_database_url
SENDGRID_API_KEY=your_sendgrid_api_key

```

#### Initialize the database and start the scheduler by updating main.py:

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
db = SQLAlchemy(app)

scheduler = BackgroundScheduler()
scheduler.start()

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
```

#### Run the application:
```bash
flask run
```

#### 3. Frontend Setup:
Navigate to the frontend directory:
```bash
cd ../Frontend
```

#### Install the required packages:
```bash
npm install
```

#### Run the React application:
```bash
npm run dev
```
### Usage

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Log in with the following credentials:
   - **Email:** testingjobquest@gmail.com
   - **Password:** JobQuest24!

### Email Reminder Feature:

- After logging in, navigate to the **"Jobs"** section.
- Add a new job with a reminder date.
- The system will automatically schedule a reminder email for the specified date.

### API Endpoints

#### User Management

- **Register User:** `POST /api/users/register`

##### Request Body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

- **Get All Users:** `GET /api/users/all`

- **Update User:** `PUT /api/users/update/<user_id>`

##### Request Body:
```json
{
  "username": "string",
  "email": "string"
}
```
- **Delete User:** `DELETE /api/users/delete/<user_id>`

### Authentication

- **Login:** `POST /api/auth/login`

##### Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

### Job Management

- **Create Job:** `POST /api/jobs/register`

##### Request Body:
```json
{
  "title": "string",
  "company": "string",
  "description": "string",
  "status": "string",
  "reminder_date": "YYYY-MM-DD"
}
```

- **Get All Jobs:** `GET /api/jobs/all`

- **Update Job:** `PUT /api/jobs/update/<job_id>`

##### Request Body:

```json
{
  "title": "string",
  "company": "string",
  "description": "string",
  "status": "string",
  "reminder_date": "YYYY-MM-DD"
}
```

- **Delete Job:** `DELETE /api/jobs/delete/<job_id>`

###Follow-Ups
- **Create Follow-Up:** `POST /api/follow_ups/register`

##### Request Body:
```json
{
  "job_id": "integer",
  "follow_up_date": "YYYY-MM-DD",
  "notes": "string"
}
```

- **Get All Follow-Ups:** `GET /api/follow_ups/all`

- **Update Follow-Up:** `PUT /api/follow_ups/update/<follow_up_id>`

##### Request Body:
```json
{
  "follow_up_date": "YYYY-MM-DD",
  "notes": "string"
}
```

- **Delete Follow-Up:** `DELETE /api/follow_ups/delete/<follow_up_id>`

---

### Contributing

We welcome contributions! Please read our Contributing Guidelines for more information.

---

### License

This project is licensed under the MIT License. See the LICENSE file for details.

---

### Contact

For questions or feedback, reach us at: [support@jobquest.com](mailto:questjobs24@gmail.com)

---







