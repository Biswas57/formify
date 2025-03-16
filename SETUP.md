# 🚀 Project Setup Guide

This guide walks you through setting up the **frontend (React + Vite)** and **backend (Django + MongoDB)** after cloning the repository.

---

## 🛠 **Prerequisites**
Ensure you have the following installed:

### **Frontend (React + Vite)**
- **Node.js (>= 18.x)** → [Download](https://nodejs.org/)
- **npm (comes with Node.js)**

### **Backend (Django + MongoDB)**
- **Python (>= 3.8)** → Check with `python3 --version`
- **pip (Python package manager)** → Check with `pip --version`
- **MongoDB (Installed & Running)** → [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)

---

## 🔧 **Setup Instructions (Mac & WSL)**
After cloning the repo:

```sh
git clone https://github.com/your-repo.git
cd your-repo
```

---

## **1️⃣ Backend Setup (Django)**
### **1.1 Navigate to Backend**
```sh
cd backend
```

### **1.2 Create and Activate a Virtual Environment**
```sh
python3 -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate virtual environment
```

### **1.3 Install Dependencies**
```sh
pip install -r requirements.txt
```

### **1.4 Set Up Environment Variables**
Create a `.env` file inside `backend/backend/`:
```sh
touch backend/backend/.env
```
Add the following to `.env`:
```ini
OPENAI_API_KEY="your openAI key"
```

---

## **2️⃣ Frontend Setup (React + Vite)**
### **2.1 Navigate to Frontend**
```sh
cd ../frontend
```

### **2.2 Install Dependencies**
```sh
npm install
```

---

## 🚀 **Running the Project**
Run **both frontend and backend** in separate terminals.

### **1️⃣ Start the Backend (Django)**
```sh
cd backend
source venv/bin/activate
```
To run the backend server, run one of the following commands (one of these will work):
```
daphne -p 8000 backend.asgi:application

python -m daphne -p 8000 backend.asgi:application

daphne -b 0.0.0.0 -p 8000 backend.asgi:application

python -m daphne -b 0.0.0.0 -p 8000 backend.asgi:application
```
Backend will be running at **`http://localhost:8000/`**.

---

### **2️⃣ Start the Frontend (React)**
```sh
cd frontend
npm run dev
```
Frontend will be running at **`http://localhost:5173/`**.

---

## 🎯 **You're All Set!**
- **Backend API**: `http://localhost:8000/api/`
- **Frontend UI**: `http://localhost:5173/`
