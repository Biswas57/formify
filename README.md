## Local Development Deployment Guide for Formify Application

This guide outlines the steps to set up and deploy the Formify application locally. The application uses a Django-based backend (Python) and a React-based frontend. Follow the steps below to configure, run, and test your development environment.

### Table of Contents
- Prerequisites
- Backend Setup (Django)
  - Set Up a Python Virtual Environment
  - Install Python Dependencies
  - Configuration
  - Database Migrations
  - Running the Server
- Frontend Setup (React)
  - Installing Dependencies
  - Running the Development Server
- Testing and API Endpoints
- Troubleshooting
- Additional Notes

---

## Prerequisites
- Python (version 3.8 or higher recommended)
- Node.js (v14 or later) & npm (or yarn) for the React frontend
- Git (optional, for version control)
- A virtual environment tool (e.g., venv or virtualenv)

---

## Backend Setup (Django)

### Set Up a Python Virtual Environment
``bash
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
``

### Install Python Dependencies
Ensure that your `requirements.txt` includes all necessary packages (e.g., Django 5.1.7, djangorestframework, channels, etc.) and run:

``bash
pip install -r requirements.txt
``

---

### Configuration

#### Environment Variables
Create a `.env` file in your backend directory with at least the following variable:

``dotenv
OPENAI_API_KEY=your_openai_api_key_here
``

Replace `your_openai_api_key_here` with your actual OpenAI API key.

#### Django Settings
- **DEBUG Flag**: Ensure the `DEBUG` flag is set to `True` for development.
- **Allowed Hosts**: Configure `ALLOWED_HOSTS` appropriately (e.g., leave it empty or include `localhost`).
- **CORS Settings**: In `backend/settings.py`, ensure the CORS settings allow the frontend origin, for example:

``python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
``

---

### Database Migrations

#### Apply Migrations
Set up the SQLite database (or your preferred database) by running:

``bash
python manage.py migrate
``

#### Create a Superuser (Optional)
To access the Django admin interface, run:

``bash
python manage.py createsuperuser
``

---

### Running the Server

#### Start the Django Development Server
``bash
python manage.py runserver
``

The backend server will be available at `http://localhost:8000`.

#### Channels & ASGI Support
The ASGI configuration supports both HTTP and WebSocket protocols via Django Channels, allowing real-time audio transcription and related functionality.

---

## Frontend Setup (React)

### Installing Dependencies

#### Navigate to the Frontend Directory
``bash
cd path/to/frontend
``

#### Install Node Dependencies
Use either `npm` or `yarn` to install the dependencies:

``bash
npm install
``

or

``bash
yarn install
``

---

### Running the Development Server

Start the React development server:

``bash
npm start
``

The frontend will run on `http://localhost:5173` and is configured to communicate with the Django backend at `http://localhost:8000`.

---

## Testing and API Endpoints

- **API Endpoints**:
  - Authentication endpoints are available at `/api/auth/`.
  - Other endpoints (e.g., form creation, list, and detail) are routed as defined in your Django configuration.

- **Admin Panel**:
  - Visit `http://localhost:8000/admin` to log in with your superuser credentials.

- **WebSocket Testing**:
  - The backend uses Django Channels to handle WebSocket connections (e.g., for audio transcription).
  - Ensure that your frontend components (like `FormWithRecorder`) are correctly set up to manage real-time communication.

---

## Troubleshooting

### Import or Module Errors
- Verify that the virtual environment is activated and all dependencies are installed.

### CORS Issues
- Ensure that `CORS_ALLOWED_ORIGINS` in `backend/settings.py` includes the frontend URL (e.g., `"http://localhost:5173"`).

### Port Conflicts
- If default ports (`8000` for backend, `5173` for frontend) are in use, adjust them accordingly in your configurations.

---

## Additional Notes

### Hot Reloading
- Both Django and React support hot reloading. Changes in your code should automatically reflect upon saving.

### Integration with OpenAI and Whisper
- The backend integrates with OpenAI’s Whisper API and GPT models.
- Ensure that your API key is valid and that you have the necessary access to these services.

### Static Files
- Django’s static files are served via the `STATIC_URL` configuration.
- For production, consider using a dedicated static files server or CDN.

---

By following these instructions, you can successfully set up and run the **Formify** application for local development. **Enjoy coding!**
