# HooBank - Modern Banking Web Application

![HooBank Dashboard Screenshot](https://placehold.co/1200x600/000/FFF?text=HooBank+Dashboard+Screenshot)
*(**Note:** Replace this placeholder with an actual screenshot of your application's dashboard for better visual representation.)*

## 🚀 Project Overview

HooBank is a modern, full-stack banking web application designed to provide users with a secure and intuitive platform for managing their financial activities. Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), this application demonstrates a robust architecture for handling user authentication, transaction viewing, and basic account management.

It's an excellent example of how to build a client-server application with separate frontend and backend components, secure API communication, and a seeded database for easy development and testing.

## ✨ Features

### Frontend (React.js)
* **Responsive Design:** Crafted with Tailwind CSS to ensure optimal viewing and interaction across various devices (desktops, tablets, and mobile phones).
* **User-Friendly Interface:** A clean, intuitive, and visually appealing design for an enhanced banking experience.
* **Secure Authentication Flow:** Implements robust client-side validation for both user signup and login processes.
* **Custom Alert Modals:** Replaces native browser `alert()` and `confirm()` prompts with custom, styled modal dialogs for consistent user feedback.
* **Dynamic Dashboard:** Presents a personalized overview including the current account balance, account holder's name, and total transaction count.
* **Detailed Transaction History:** Displays a comprehensive table of all financial transactions, including date, description, type (credit/debit), amount, and a unique reference.
* **Spending Trends Visualization:** Utilizes Recharts to generate interactive line charts, offering a clear visual representation of spending patterns over time.
* **Session Management:** Persists user authentication tokens and basic user data in local storage for a seamless experience across sessions.

### Backend (Node.js/Express.js API)
* **RESTful API:** Developed using Node.js and Express.js to provide a scalable and efficient API for frontend communication.
* **MongoDB Database:** Leverages MongoDB as the NoSQL data store, managed through Mongoose for robust Object Data Modeling (ODM).
* **Comprehensive Authentication & Authorization:**
    * **User Registration (Signup):** Allows new users to create online banking access by linking to a pre-existing bank account number and its associated debit PIN (seeded in the database).
    * **User Login:** Authenticates users via email and password credentials.
    * **JWT (JSON Web Token) Based Security:** Secures API endpoints using JWTs for stateless authentication.
    * **Account Lockout Mechanism:** Implements a security feature to temporarily lock user accounts after multiple consecutive failed login attempts, protecting against brute-force attacks.
    * **Protected Routes:** Utilizes custom middleware to ensure that sensitive API endpoints are only accessible to authenticated users.
* **Structured Data Models:** Defines clear Mongoose schemas for `User`, `Account`, and `Transaction` entities, ensuring data integrity and relationships.
* **Secure Credential Handling:** Passwords and debit PINs are securely hashed using `bcryptjs` before being stored in the database.
* **Centralized Error Handling:** A global error handling middleware ensures consistent and informative error responses across the API.
* **Database Seeding:** A powerful script to pre-populate the database with sample accounts, users, and transactions, making initial setup and testing incredibly easy.

## 🛠️ Technologies Used

### Frontend
* **React.js:** Core library for building the user interface.
* **React Router DOM:** For client-side routing and navigation.
* **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
* **Recharts:** A flexible charting library for data visualization.

### Backend
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for data storage.
* **Mongoose:** ODM library for MongoDB and Node.js.
* **`jsonwebtoken`:** For creating and verifying JWTs.
* **`bcryptjs`:** For hashing passwords and PINs.
* **`dotenv`:** To manage environment variables.
* **`cors`:** Middleware for enabling Cross-Origin Resource Sharing.
* **`nodemon`:** A development tool for automatic server restarts on file changes.

## ⚙️ Prerequisites

Before you get started, ensure you have the following installed on your development machine:

* **Node.js** (LTS version recommended) & **npm** (comes with Node.js) or **Yarn**
* **MongoDB Community Server** (running locally) or access to a **MongoDB Atlas** cluster.

## 🚀 Getting Started

Follow these steps to set up and run the HooBank application locally on your machine.

### 1. Clone the Repository

First, clone the project from its GitHub repository to your local machine:

```bash
git clone [https://github.com/Afreed007/HooBank_Mern.git](https://github.com/Afreed007/HooBank_Mern.git)
cd HooBank_Mern
