// // // scripts/seedData.js
// // import mongoose from 'mongoose';
// // import bcrypt from 'bcryptjs';
// // import dotenv from 'dotenv';
// // import Account from '../src/models/Account.js';
// // import Transaction from '../src/models/Transaction.js';

// // dotenv.config();

// // const sampleAccounts = [
// //   {
// //     accountNumber: "01234567890",
// //     debitPin: "1234",
// //     accountHolderName: "John Doe",
// //     balance: 1,      // ending balance
// //     accountType: "savings"
// //   },
// //   {
// //     accountNumber: "0987654321",
// //     debitPin: "5678",
// //     accountHolderName: "Jane Smith",
// //     balance: 18000,
// //     accountType: "current"
// //   },
// //   {
// //     accountNumber: "1122334455",
// //     debitPin: "9999",
// //     accountHolderName: "Mike Johnson",
// //     balance: 30500,
// //     accountType: "salary"
// //   }
// // ];

// // // Define per-account transaction history
// // const sampleTransactionsByAccount = {
// //   "1234567890": [
// //     { type: "credit", amount: 20000, description: "Initial deposit" },
// //     { type: "debit",  amount: -1500,  description: "ATM Withdrawal" },
// //     { type: "debit",  amount: -2000,  description: "Grocery shopping" }
// //   ],
// //   "0987654321": [
// //     { type: "credit", amount: 15000, description: "Salary Credit" },
// //     { type: "debit",  amount: -2000,  description: "Utility bills" }
// //   ],
// //   "1122334455": [
// //     { type: "credit", amount: 30000, description: "Project payout" },
// //     { type: "debit",  amount: -500,   description: "Coffee shop" }
// //   ]
// // };

// // const seedDatabase = async () => {
// //   try {
// //     await mongoose.connect(process.env.MONGODB_URI);
// //     console.log('✅ Connected to MongoDB');

// //     // Clear old data
// //     await Transaction.deleteMany({});
// //     await Account.deleteMany({});
// //     console.log('🗑️ Cleared existing accounts & transactions');

// //     // For each sample account...
// //     for (const acctData of sampleAccounts) {
// //       // 1) Hash PIN and save account
// //       const hashedPin = await bcrypt.hash(acctData.debitPin, 12);
// //       const account = await Account.create({
// //         ...acctData,
// //         debitPin: hashedPin
// //       });
// //       console.log(`✅ Created account ${account.accountNumber}`);

// //       // 2) Create that account’s historical transactions
// //       const txns = sampleTransactionsByAccount[acctData.accountNumber] || [];
// //       let runningBalance = 0;
// //       // Compute running balance based on each txn in order
// //       for (const t of txns) {
// //         runningBalance += t.amount;
// //         await Transaction.create({
// //           accountNumber: acctData.accountNumber,
// //           type: t.type,
// //           amount: t.amount,
// //           description: t.description,
// //           balanceAfter: runningBalance
// //         });
// //       }
// //       console.log(`   → Seeded ${txns.length} transactions for ${acctData.accountNumber}`);
// //     }

// //     console.log('🎉 Seed data complete!');
// //     process.exit(0);

// //   } catch (err) {
// //     console.error('❌ Seed error:', err);
// //     process.exit(1);
// //   }
// // };

// // seedDatabase();

// // src/seed.js
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';
// import Account from './models/Account.js';
// import User from './models/User.js';
// import Transaction from './models/Transaction.js';

// dotenv.config();

// const seedDatabase = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('✅ MongoDB Connected for seeding.');

//         // Clear existing data
//         await Account.deleteMany({});
//         await User.deleteMany({});
//         await Transaction.deleteMany({});
//         console.log('🗑️ Existing data cleared.');

//         // Create a sample Account
//         const sampleAccountNumber = '1234567890';
//         const sampleDebitPin = '1234'; // This will be hashed by the pre-save hook
//         const hashedPin = await bcrypt.hash(sampleDebitPin, 12); // Manually hash for seeding

//         const account = await Account.create({
//             accountNumber: sampleAccountNumber,
//             debitPin: hashedPin, // Use the manually hashed PIN
//             accountHolderName: 'Demo User',
//             balance: 50000, // Initial balance
//             isActive: true,
//             accountType: 'savings',
//         });
//         console.log(`👤 Sample Account created: ${account.accountHolderName} (${account.accountNumber})`);

//         // Create a sample User linked to the account
//         const sampleEmail = 'demo@example.com';
//         const samplePassword = 'password123'; // This will be hashed by the pre-save hook
//         const hashedPassword = await bcrypt.hash(samplePassword, 12); // Manually hash for seeding

//         const user = await User.create({
//             accountNumber: account.accountNumber,
//             email: sampleEmail,
//             password: hashedPassword, // Use the manually hashed password
//             isVerified: true,
//             lastLogin: new Date(),
//         });
//         console.log(`👨‍💻 Sample User created: ${user.email}`);

//         // Create sample Transactions for the account
//         const transactionsData = [
//             { accountNumber: account.accountNumber, type: 'credit', amount: 10000, description: 'Initial Deposit', balanceAfter: 10000, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }, // 5 days ago
//             { accountNumber: account.accountNumber, type: 'debit', amount: -2500, description: 'Online Shopping', balanceAfter: 7500, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }, // 4 days ago
//             { accountNumber: account.accountNumber, type: 'credit', amount: 5000, description: 'Salary Deposit', balanceAfter: 12500, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // 3 days ago
//             { accountNumber: account.accountNumber, type: 'debit', amount: -1500, description: 'Restaurant Bill', balanceAfter: 11000, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
//             { accountNumber: account.accountNumber, type: 'debit', amount: -500, description: 'Coffee', balanceAfter: 10500, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }, // 1 day ago
//             { accountNumber: account.accountNumber, type: 'credit', amount: 40000, description: 'Investment Return', balanceAfter: 50500, createdAt: new Date() }, // Today
//             { accountNumber: account.accountNumber, type: 'debit', amount: -500, description: 'Groceries', balanceAfter: 50000, createdAt: new Date(Date.now() + 1000) }, // A bit later today
//         ];

//         const transactions = await Transaction.insertMany(transactionsData);
//         console.log(`💸 ${transactions.length} Sample Transactions created.`);

//         // Update account's transactions array with object IDs
//         account.transactions = transactions.map(txn => txn._id);
//         account.balance = transactions[transactions.length - 1].balanceAfter; // Set final balance based on last transaction
//         await account.save();
//         console.log('📊 Account transactions and balance updated.');


//         console.log('\n✨ Database seeding complete! ✨');
//         console.log(`
//         Use these credentials to test:
//         Account Number: ${sampleAccountNumber}
//         Debit PIN: ${sampleDebitPin}
//         Email: ${sampleEmail}
//         Password: ${samplePassword}
//         `);

//     } catch (error) {
//         console.error('❌ Database seeding failed:', error);
//         process.exit(1);
//     } finally {
//         mongoose.connection.close();
//         console.log('MongoDB connection closed after seeding.');
//     }
// };

// seedDatabase();
