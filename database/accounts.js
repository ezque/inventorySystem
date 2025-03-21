import getDB from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

async function hashPassword(password) {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
}

async function setupAccountsTable() {
    const db = await getDB();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);
    console.log("Accounts table is ready.");
    await checkAndInsertDefaultAccount();
}

async function checkAndInsertDefaultAccount() {
    const db = await getDB();
    
    const result = await db.getAllAsync("SELECT COUNT(*) as count FROM accounts");

    const count = result[0]?.count || 0;

    if (count === 0) {
        const hashedPassword = await hashPassword("12345");
        await db.runAsync(
            "INSERT INTO accounts (email, password) VALUES (?, ?)",
            ["swiftstock@gmail.com", hashedPassword]
        );
        console.log("Default account created.");
    }
}


async function loginAccount(email, password) {
    const db = await getDB();
    const hashedPassword = await hashPassword(password);

    const result = await db.getAllAsync(
        "SELECT * FROM accounts WHERE email = ?",
        [email]
    );

    if (result.length > 0 && result[0].password === hashedPassword) {
        await AsyncStorage.setItem('loggedInUser', email);
        return true;
    }
    return false;
}


async function checkAuth(callback) {
    const userEmail = await AsyncStorage.getItem('loggedInUser');
    callback(userEmail !== null);
}

async function logoutUser() {
    await AsyncStorage.removeItem('loggedInUser');
}


async function resetDatabase() {
    const db = await getDB();
    
    await db.execAsync(`DROP TABLE IF EXISTS accounts`);
    console.log("Accounts table dropped.");

    await setupAccountsTable();
    console.log("Database reset and accounts table recreated.");
}

export { setupAccountsTable, loginAccount, checkAuth, logoutUser, resetDatabase };
