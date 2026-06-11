# Deployment Guide: Employee Management System (MERN Stack)

This guide walks you through setting up MongoDB Atlas, deploying the Express backend to **Render**, deploying the React frontend to **Vercel**, and linking them together using environment variables.

---

## 1. MongoDB Atlas Database Setup

MongoDB Atlas is a fully managed cloud database service. We will use their free tier.

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create an account.
2. **Create a Free Cluster**:
   - Choose the **M0 Free** tier.
   - Choose your preferred cloud provider (e.g., AWS) and region nearest to you.
   - Click **Create**.
3. **Database Security (Username/Password)**:
   - In the database setup wizard, create a database user.
   - Enter a **Username** (e.g., `db_user`) and a secure **Password**. Save these credentials.
4. **Network Access (IP Whitelisting)**:
   - Vercel and Render deploy to dynamic IP addresses, so you must allow connections from anywhere for this demo.
   - Under **IP Access List**, add the IP address `0.0.0.0/0` (which matches all IP addresses).
   - Enter a description like "Allow access from anywhere for cloud deployment".
5. **Get Connection String**:
   - Go to your Cluster page and click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string. It will look like this:
     ```text
     mongodb+srv://<db_user>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with the password you created for the database user, and optionally specify a database name before the `?` (e.g., `...mongodb.net/employee_db?retryWrites...`).

---

## 2. Deploy Backend on Render

Render is a cloud platform that makes it extremely simple to host Node.js/Express web services.

1. **Push code to GitHub**: Create a repository on GitHub and push your workspace.
2. **Log into Render**: Create an account or log in to [Render](https://render.com) using your GitHub account.
3. **Create a New Web Service**:
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository.
4. **Configure Web Service**:
   - **Name**: `employee-management-api`
   - **Region**: Select a region close to your database/users.
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (very important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Add Environment Variables**:
   - Scroll down to the **Environment** section or click the **Env Groups / Environment** tab.
   - Add the following keys:
     - `MONGODB_URI`: *Your MongoDB connection string from Step 1.*
     - `PORT`: `10000` (Render defaults, or it will assign one automatically).
6. **Deploy**: Click **Deploy Web Service**.
7. **Copy API URL**: Once deployed, Render will provide a public URL for your web service, e.g., `https://employee-management-api.onrender.com`.

---

## 3. Deploy Frontend on Vercel

Vercel is the premier hosting provider for frontend applications, specializing in fast, global delivery of static files and single page applications.

1. **Log into Vercel**: Go to [Vercel](https://vercel.com) and sign up/log in with GitHub.
2. **Add New Project**:
   - Click **Add New** and select **Project**.
   - Import your GitHub repository.
3. **Configure Project Settings**:
   - **Project Name**: `employee-hub`
   - **Framework Preset**: **Vite** (Vercel should auto-detect this)
   - **Root Directory**: `frontend` (very important!)
   - **Build and Output Settings**: Default settings will work:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
4. **Add Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add the following key:
     - `VITE_API_URL`: *Your Render backend URL + `/api/employees`* (e.g., `https://employee-management-api.onrender.com/api/employees`).
5. **Deploy**: Click **Deploy**.
6. **Access App**: Once compilation finishes, Vercel will give you a public URL (e.g., `https://employee-hub.vercel.app`) to access your fully functional, connected live application.

---

## 4. Local Development Walkthrough

To run the full stack locally for testing before deployment:

1. **Configure local environment variables**:
   - In `backend/`, copy `.env.example` to `.env` and fill in `MONGODB_URI` with your connection string.
   - In `frontend/`, copy `.env.example` to `.env` (optional, as the app falls back to `http://localhost:5000/api/employees` if empty).

2. **Start Backend**:
   - In your terminal, go to the `backend/` directory and run:
     ```bash
     npm run dev
     ```
   - It should log: `Server is running on port 5000` and `Successfully connected to MongoDB Atlas.`

3. **Start Frontend**:
   - Open a separate terminal, go to the `frontend/` directory, and run:
     ```bash
     npm run dev
     ```
   - Open your browser to the local URL (usually `http://localhost:5173`).
