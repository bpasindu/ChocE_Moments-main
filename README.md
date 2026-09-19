<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ChocE Moments

This is a MERN (MongoDB, Express, React, Node.js) project for ChocE Moments, a premium handmade chocolate gifting platform.

View your app in AI Studio: https://ai.studio/apps/drive/1_afW6if5XHelWsZeYhiH0If0BWfzum1K

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - You can either:
   - Install MongoDB locally - [Download here](https://www.mongodb.com/try/download/community)
   - Use MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)
3. **npm** (comes with Node.js) or **yarn**

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
# From the root directory
npm install
```

### Step 2: Set Up Environment Variables

#### Backend
1. Navigate to the `backend` folder
2. Create a `.env` file
3. Add the following variables:

```env
DATABASE_URL=mongodb://localhost:27017/choce_moments
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

#### Frontend
1. In the root directory, create/edit `.env` or `.env.local`
2. Add your Gemini API key:
```env
GEMINI_API_KEY=your_key_here
```

### Step 3: Start the Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Step 4: Start the Frontend Development Server

Open a **new terminal window**, and from the root directory:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
ChocE_Moments/
├── backend/              # Backend API (Express + MongoDB)
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB models
│   ├── routers/          # API routes
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── frontend/             # Frontend (React + Vite)
│   ├── components/       # React components
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```
