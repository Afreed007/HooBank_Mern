# 💳 HooBank - Your Awesome Online Banking App!

Welcome to **HooBank**, a full-stack online banking app built using the powerful **MERN stack** (MongoDB, Express.js, React.js, Node.js). This app demonstrates a secure, responsive, and interactive banking experience with real-world features like user authentication, transaction tracking, spending insights, and more.

---

## 🚀 What is HooBank?

**HooBank** is a modern banking dashboard application that simulates online banking for users. It includes features like account creation, secure login, transaction history, analytics through charts, and more.

It's ideal for MERN developers looking to understand real-world full-stack project architecture with clean design and solid backend security.

---

## ✨ Features

### 🔹 Frontend (React.js + Tailwind CSS)
- 🌐 **Fully Responsive UI** across devices using Tailwind CSS
- ✅ **Authentication System** (Signup/Login with secure flow)
- 📊 **Dashboard** with account summary and transaction tracking
- 📁 **Transaction History Table**
- 📈 **Spending Analytics with Charts** (via Recharts)
- 🔔 **Custom Alerts & Pop-ups**
- 🔐 **JWT-Based Session Persistence**

### 🔹 Backend (Node.js + Express.js + MongoDB)
- ⚙️ REST API built with Express.js
- 🛡️ Authentication with JWT and bcrypt
- 🔐 Account lockout after failed login attempts
- 📦 MongoDB with Mongoose models for Users, Accounts, Transactions
- 🧪 Seed Script for demo/test data
- 🧱 Structured folder architecture with Controllers, Routes, Middleware

---

## 📂 Project Structure

```bash
HooBank_Mern/
├── banking-app-backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       └── seed.js
└── banking-app-frontend/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   ├── constants/
    │   ├── index.js
    │   ├── index.css
    │   └── style.js

```
HooBank – Modern MERN Online Banking App 🚀
Welcome to HooBank, a full-stack demo banking platform powered by the MERN stack (MongoDB, Express.js, React.js, Node.js). The project demonstrates secure authentication, responsive design, interactive charts, and a robust REST API—everything you need to explore how a real-world online-banking system is built.

✨ Key Features
Layer	Highlights
Frontend (React + Tailwind CSS)	• 100 % responsive layout
• Clean, accessible UI
• Custom modal dialogs (no default alerts)
• Persistent JWT login
• Dashboard with balance, owner, transaction count
• Transaction table (date, type, amount, ref)
• Spending-analysis charts via Recharts
Backend (Node + Express)	• RESTful API (versioned routes)
• JWT authentication & role-based guards
• Password & PIN hashing with bcryptjs
• Account lock-out after repeated failures
• Centralised error handler with friendly JSON responses
• Seed script for instant demo data
Database (MongoDB + Mongoose)	• Schemas for Users, Accounts, Transactions
• Virtuals & middleware for hashing sensitive fields
• Config-driven connection (local or Atlas)
🖥️ Local Demo Credentials
After running the seed script you can:

Purpose	Account #	Debit PIN	Email	Password
Demo login	1234567890	1234	demo@example.com	password123
Signup sample	9876543210	5678	(choose one)	(choose one)
⚙️ Prerequisites
Node.js (LTS) & npm or Yarn

MongoDB Community Server or MongoDB Atlas cluster

🚀 Quick Start
bash
# 1 – clone
git clone https://github.com/Afreed007/HooBank_Mern.git
cd HooBank_Mern

# 2 – backend
cd banking-app-backend
npm install      # or yarn
cp .env.example .env   # then edit values (see below)
npm run seed     # ⬆️ populat
