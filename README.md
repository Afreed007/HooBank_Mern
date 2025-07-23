HooBank - Your Awesome Online Banking App!
🚀 What's This All About?
Hey there! Welcome to HooBank, your super cool, modern online banking app. We've built this whole thing using the MERN stack (that's MongoDB, Express.js, React.js, and Node.js – fancy, right?). It's designed to make managing your money easy-peasy and totally secure.

Think of it as your personal financial hub, where you can check your accounts, see where your money's going, and even get some neat insights into your spending. It's a full-on, real-world app that shows how all these tech pieces fit together.

✨ Cool Stuff It Can Do!
For You (The Frontend - React.js)
Looks Great Everywhere! Whether you're on your phone, tablet, or big computer screen, our app adjusts perfectly. No weird squishing or stretching here, thanks to Tailwind CSS!

Super Easy to Use: We've made the design clean and friendly. Banking shouldn't be a headache!

Safe & Sound Login: Signing up and logging in is rock-solid. We've got smart checks on your end to keep things secure.

Friendly Pop-Ups: Forget those annoying browser alerts! We've got custom, good-looking messages that pop up to tell you what's happening. Much nicer!

Your Personal Dashboard: Get a quick peek at your current balance, who the account belongs to, and how many transactions you've made. All in one spot!

See All Your Money Moves: A clear table shows every single transaction – when it happened, what it was for, if it was money in or out, how much, and a handy reference number.

Smart Spending Charts: Ever wonder where your money goes? Our cool charts (powered by Recharts) give you a visual breakdown of your spending over time. Super helpful!

Stays Logged In: Once you're in, you're in! We remember you so you don't have to keep logging in every time.

Behind the Scenes (The Backend - Node.js/Express.js API)
It's a Smart Server! Our backend is built with Node.js and Express.js. It's like the brain of the operation, sending all the right info to your app.

MongoDB - Our Data Vault: We use MongoDB to store all your banking info. It's super flexible and keeps everything organized.

Top-Notch Security & Access:

Easy Signup: You can create your online access by linking up your existing bank account number and debit PIN. We've even pre-loaded some for you to try!

Simple Login: Just your email and password, and you're good to go.

Secret Tokens (JWT): We use these special tokens to make sure only you can access your banking info. Super safe!

Account Lockout: Tried logging in too many times with the wrong password? No worries, we'll temporarily lock your account to keep it safe. Just wait a bit, and you can try again.

Protected Areas: Certain parts of your banking info are extra protected. Our system makes sure only you can get in.

Organized Data: All your user, account, and transaction info is neatly structured in our database.

Super Secure Passwords: Your passwords and PINs are scrambled up (hashed with bcryptjs) before they even touch our database. So nobody can see them!

Smart Error Messages: If something goes wrong, our system is set up to give clear, helpful error messages. No more guessing!

Instant Test Data! We've got a special script that fills up your database with fake accounts and transactions. This makes it a breeze to get started and test everything out.

🛠️ What We Used to Build It
For the App You See (Frontend)
React.js: The main tool for building all the cool buttons and screens.

React Router DOM: Helps the app jump between different pages smoothly.

Tailwind CSS: Our secret sauce for making everything look good without a ton of custom CSS.

Recharts: Makes those awesome spending charts happen!

For the Brains of the Operation (Backend)
Node.js: The engine that runs our JavaScript server.

Express.js: Helps us build the server quickly and efficiently.

MongoDB: Our database where all your info lives.

Mongoose: Helps Node.js talk to MongoDB easily.

jsonwebtoken: For those secure secret tokens!

bcryptjs: Keeps your passwords super secret.

dotenv: Helps us manage important settings securely.

cors: Lets your app talk to our server without any fuss.

nodemon: A handy tool that automatically restarts the server when we make changes. Saves a lot of time!

⚙️ What You Need to Get Started
Before you dive in, just make sure you have these installed:

Node.js (the recommended version is best!) & npm (it comes with Node.js!) or Yarn.

MongoDB Community Server (running on your computer) or a MongoDB Atlas account (that's MongoDB in the cloud!).

🚀 Let's Get This Party Started!
Ready to fire up HooBank? Just follow these simple steps:

1. Grab the Code!
First things first, get the project from GitHub:

git clone https://github.com/Afreed007/HooBank_Mern.git
cd HooBank_Mern

2. Set Up the Backend (The Server Part)
Jump into the banking-app-backend folder:

cd banking-app-backend

A. Install Backend Goodies:

Get all the necessary server stuff installed:

npm install
# or
yarn install

B. Create Your Secret .env File:

Make a file called .env right in the banking-app-backend folder. This is where your important settings live. Make sure to change the placeholder values!

PORT=5000
MONGODB_URI=mongodb://localhost:27017/banking_app # HEY! Change this if your MongoDB is somewhere else!
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_JWT_SECRET_KEY # THIS IS SUPER IMPORTANT! Make it long and random!
CLIENT_URL=http://localhost:3000 # Make sure this matches where your app will run!
NODE_ENV=development

MongoDB Heads Up: Is your MongoDB running? If it's local, mongodb://localhost:27017/banking_app is usually fine. If you're using MongoDB Atlas, grab your connection string from there.

JWT_SECRET: Seriously, make this a long, crazy, random string. It's for security!

C. Fill Up Your Database! (Super Important First Step!)

This part puts all the demo accounts and transactions into your database. You absolutely need to do this successfully before you can log in or sign up.

Double-check your MongoDB server is running!

Run the magic seed script:

npm run seed
# or
yarn seed

Look Closely! You should see messages in your console saying accounts, users, and transactions were created successfully. If you see any errors, stop, fix them, and try again!

Just Once! Only run this command once to set things up. If you ever want to wipe your database clean and start fresh, you can run it again, but it'll delete everything first!

D. Fire Up the Backend!

Once everything's installed and seeded, let's get the server running:

npm run dev
# or
yarn dev

Your server should be buzzing away at http://localhost:5000. Keep that terminal window open, okay?

3. Set Up the Frontend (The App You See!)
Open up a brand new terminal window and head into the banking-app-frontend folder:

cd ../banking-app-frontend

A. Install Frontend Goodies:

Time to get all the React and other app-related stuff installed:

npm install
# or
yarn install

B. Launch the App!

npm start
# or
yarn start

Your awesome banking app should pop open in your web browser, usually at http://localhost:3000. Woohoo!

🔑 Ready to Test? Here Are Your Login Details!
After you've successfully seeded your database (npm run seed), you can use these accounts to play around:

1. Your Pre-Registered Demo Account (For Logging In)
This one's already set up and ready for you to log in.

Bank Account Number: 1234567890

Debit PIN: 1234

Email: demo@example.com

Password: password123

2. A Fresh Account for Signing Up!
This account exists in our database, but it's waiting for you to create an online banking user for it!

Bank Account Number: 9876543210

Debit PIN: 5678

How to Sign Up with This Account:

Head over to the "Create Bank Account Access" (Signup) form on the app.

Type in the Bank Account Number (9876543210) and Debit PIN (5678).

Then, pick a brand new, unique email address (like jane.doe@example.com or your.name@test.com).

And create a new password for this account (e.g., newpassword123).

Hit "Create Account"!

🖥️ How to Play Around with the App!
Open It Up: Go to http://localhost:3000 in your web browser.

Log In:

Click "Get Started" or whatever button opens the login/signup screen.

If you're on the signup form, click "Sign In Here" to switch.

Use the details for the Pre-registered Demo Account (demo@example.com / password123).

Click "Sign In". Boom! You're on the dashboard, seeing "Demo User"'s transactions.

Sign Up for a New Account:

If you're logged in, hit "Logout" on the dashboard first.

Go back to the homepage and open the Login/Signup screen.

If you're on the login form, click "Register Now" to switch.

Use the Bank Account Number (9876543210) and Debit PIN (5678) from the Available Account for Signup.

Put in a new, unique email (like another.user@example.com) and create a new password.

Click "Create Account". Ta-da! You're on the dashboard, seeing "Jane Doe"'s transactions.

Check Your Money: Look at your account summary, scroll through your transaction history, and check out those cool spending charts!

Get Latest Info: Hit the "Refresh" button on the dashboard to pull in any new info from the server.

Log Out: When you're done, just click "Logout" to head back to the homepage.

📂 How It's All Organized
HooBank_Mern/
├── banking-app-backend/
│   ├── .env                 # Secret settings for the server (MongoDB, JWT key, etc.)
│   ├── package.json         # Lists all the server's tools and scripts
│   ├── server.js            # The main file that starts up the whole server
│   └── src/
│       ├── app.js           # Sets up how the server handles requests (like security and data formats)
│       ├── config/
│       │   └── database.js  # Connects the server to your MongoDB database
│       ├── controllers/
│       │   └── authController.js # Handles all the login, signup, and user verification magic
│       ├── middleware/
│       │   ├── authMiddleware.js # Makes sure only authorized people can access certain parts of the server
│       │   └── errorHandler.js   # Catches any errors on the server and sends back friendly messages
│       ├── models/
│       │   ├── Account.js        # Defines what a bank account looks like in our database (with secret PIN handling)
│       │   ├── Transaction.js    # Defines what a money transaction looks like
│       │   └── User.js           # Defines what a user account looks like (with secret password handling)
│       ├── routes/
│       │   └── auth.js           # The "road map" for all the login/signup web addresses
│       ├── seed.js             # A special script to fill your database with demo data for testing!
│       └── utils/
│           └── generateToken.js  # Helps create those secure login tokens
│
└── banking-app-frontend/
    ├── public/
    │   └── index.html       # The main webpage where your app lives (it pulls in all the other cool stuff)
    ├── src/
    │   ├── App.jsx          # The main brain of your app, handling different pages and pop-up messages
    │   ├── index.css        # All the global styles for your app
    │   ├── index.js         # The very first file React loads to start your app
    │   ├── components/
    │   │   ├── CustomAlertDialog.jsx # Our custom, nice-looking pop-up messages
    │   │   ├── LoginModal.jsx      # The screen where you log in or sign up
    │   │   ├── Dashboard.jsx       # Your personal banking overview screen!
    │   │   ├── Navbar.jsx          # The top menu bar
    │   │   ├── Hero.jsx            # The big, welcoming section on the homepage
    │   │   ├── Business.jsx        # Section about business features
    │   │   ├── Stats.jsx           # Section showing cool stats
    │   │   ├── Billing.jsx         # Section about billing
    │   │   ├── CardDeal.jsx        # Section about card deals
    │   │   ├── Testimonials.jsx    # What people are saying about us
    │   │   ├── Clients.jsx         # Our happy clients
    │   │   ├── CTA.jsx             # Call to action section
    │   │   └── Footer.jsx          # The bottom part of the page
    │   ├── constants/
    │   │   └── index.js     # Little bits of info and lists used throughout the app
    │   └── style.js         # Handy shortcuts for Tailwind CSS styles
    ├── package.json         # Lists all the app's tools and scripts

🤝 Want to Help Out?
Awesome! We'd love your help. If you have ideas, find a bug, or want to add something cool, here's how to jump in:

Make Your Own Copy: "Fork" this project on GitHub.

Start a New Branch: Create a new branch for your changes. Something like git checkout -b new-feature/my-cool-idea or fix/that-annoying-bug.

Make Your Magic Happen: Code away! Make sure everything still works.

Save Your Work: "Commit" your changes with a clear message. Like git commit -m 'feat: Added a shiny new transaction filter!'.
