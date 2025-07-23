
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; 
import Account from './models/Account.js'; 
import User from './models/User.js'; 
import Transaction from './models/Transaction.js'; 

dotenv.config(); // Load environment variables from .env file

const seedDatabase = async () => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected for seeding.');

        // Clear existing data from all relevant collections to ensure a clean slate
        await Account.deleteMany({});
        await User.deleteMany({});
        await Transaction.deleteMany({});
        console.log('🗑️ Existing data cleared.');

        // --- First Sample Account (Pre-registered User) ---
        const sampleAccountNumber1 = '1234567890';
        const sampleDebitPin1 = '1234';
        const sampleEmail1 = 'demo@example.com';
        const samplePassword1 = 'password123';

        const account1 = await Account.create({
            accountNumber: sampleAccountNumber1,
            debitPin: sampleDebitPin1, // Passed plain text, pre-save hook will hash
            accountHolderName: 'Demo User',
            balance: 50000, 
            isActive: true,
            accountType: 'savings',
        });
        console.log(`👤 Sample Account 1 created: ${account1.accountHolderName} (${account1.accountNumber})`);

        const user1 = await User.create({
            accountNumber: account1.accountNumber, 
            email: sampleEmail1,
            password: samplePassword1, // Passed plain text, pre-save hook will hash
            isVerified: true,
            lastLogin: new Date(), 
        });
        console.log(`👨‍💻 Sample User 1 created: ${user1.email}`);

        let transactionsData1 = [
            { accountNumber: account1.accountNumber, type: 'credit', amount: 10000, description: 'Initial Deposit', balanceAfter: 10000, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { accountNumber: account1.accountNumber, type: 'debit', amount: -2500, description: 'Online Shopping', balanceAfter: 7500, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { accountNumber: account1.accountNumber, type: 'credit', amount: 5000, description: 'Salary Deposit', balanceAfter: 12500, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { accountNumber: account1.accountNumber, type: 'debit', amount: -1500, description: 'Restaurant Bill', balanceAfter: 11000, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { accountNumber: account1.accountNumber, type: 'debit', amount: -500, description: 'Coffee', balanceAfter: 10500, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { accountNumber: account1.accountNumber, type: 'credit', amount: 40000, description: 'Investment Return', balanceAfter: 50500, createdAt: new Date() },
            { accountNumber: account1.accountNumber, type: 'debit', amount: -500, description: 'Groceries', balanceAfter: 50000, createdAt: new Date(Date.now() + 1000) },
        ];

        transactionsData1 = transactionsData1.map(txn => {
            if (!txn.reference) {
                txn.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
            }
            return txn;
        });

        const transactions1 = await Transaction.insertMany(transactionsData1);
        account1.transactions = transactions1.map(txn => txn._id);
        account1.balance = transactions1[transactions1.length - 1].balanceAfter; 
        await account1.save();
        console.log(`💸 ${transactions1.length} Sample Transactions created for Account 1.`);

        // --- Second Sample Account (Available for Signup) ---
        const sampleAccountNumber2 = '9876543210';
        const sampleDebitPin2 = '5678';

        const account2 = await Account.create({
            accountNumber: sampleAccountNumber2,
            debitPin: sampleDebitPin2, // Passed plain text, pre-save hook will hash
            accountHolderName: 'Mihir Divakar',
            balance: 25000, 
            isActive: true,
            accountType: 'current',
        });
        console.log(`👤 Sample Account 2 created: ${account2.accountHolderName} (${account2.accountNumber})`);

        let transactionsData2 = [
            { accountNumber: account2.accountNumber, type: 'credit', amount: 50000, description: 'Initial Funding', balanceAfter: 50000, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { accountNumber: account2.accountNumber, type: 'debit', amount: -10000, description: 'Rent Payment', balanceAfter: 40000, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
            { accountNumber: account2.accountNumber, type: 'debit', amount: -5000, description: 'Utility Bill', balanceAfter: 35000, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { accountNumber: account2.accountNumber, type: 'credit', amount: 2000, description: 'Refund', balanceAfter: 37000, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { accountNumber: account2.accountNumber, type: 'debit', amount: -12000, description: 'Car Loan', balanceAfter: 25000, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            // Added more transactions for Account 2
            { accountNumber: account2.accountNumber, type: 'debit', amount: -300, description: 'Coffee Shop', balanceAfter: 24700, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { accountNumber: account2.accountNumber, type: 'credit', amount: 1500, description: 'Freelance Income', balanceAfter: 26200, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { accountNumber: account2.accountNumber, type: 'debit', amount: -750, description: 'Restaurant', balanceAfter: 25450, createdAt: new Date(Date.now() + 2000) },
            { accountNumber: account2.accountNumber, type: 'debit', amount: -200, description: 'Bus Fare', balanceAfter: 25250, createdAt: new Date(Date.now() + 3000) },
            { accountNumber: account2.accountNumber, type: 'credit', amount: 500, description: 'Cash Deposit', balanceAfter: 25750, createdAt: new Date(Date.now() + 4000) },
        ];

        transactionsData2 = transactionsData2.map(txn => {
            if (!txn.reference) {
                txn.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
            }
            return txn;
        });

        const transactions2 = await Transaction.insertMany(transactionsData2);
        account2.transactions = transactions2.map(txn => txn._id);
        account2.balance = transactions2[transactions2.length - 1].balanceAfter; 
        await account2.save();
        console.log(`💸 ${transactions2.length} Sample Transactions created for Account 2.`);


        console.log('\n✨ Database seeding complete! ✨');
        console.log(`
        --- Demo Account 1 (Pre-registered User) ---
        Account Number: ${sampleAccountNumber1}
        Debit PIN: ${sampleDebitPin1}
        Email: ${sampleEmail1}
        Password: ${samplePassword1}

        --- Demo Account 2 (Available for Signup) ---
        Account Number: ${sampleAccountNumber2}
        Debit PIN: ${sampleDebitPin2}
        
        To test signup: Use Account 2 details with a NEW email and password.
        `);

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB connection closed after seeding.');
    }
};

seedDatabase();
