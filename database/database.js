import * as SQLite from 'expo-sqlite';

async function getDB() {
    return await SQLite.openDatabaseAsync('swiftstock.db');
}

export default getDB;
