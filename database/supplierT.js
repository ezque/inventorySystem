import getDB from './database';

async function createSupplierTable() {
    const db = await getDB();    
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS suppliers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    gender TEXT,
                    address TEXT,
                    contact TEXT
                );`,
                [],
                () => {
                    console.log("Suppliers table created successfully.");
                    resolve(true);
                },
                (_, error) => {
                    console.error("Error creating suppliers table:", error);
                    reject(error);
                }
            );
        });
    });
}

async function saveSupplier({ name, email, age, gender, address, contact }) {
    try {
        const db = await getDB();
        await db.runAsync(
            `INSERT INTO suppliers (name, email, age, gender, address, contact) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, age, gender, address, contact]
        );
        return { success: true, message: "Supplier added successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    } 
}

async function getSuppliers() {
    try {
        const db = await getDB();
        const results = await db.getAllAsync(`SELECT * FROM suppliers`);
        return results;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function updateSupplier(supplier) {
    try {
        const db = await getDB();
        await db.runAsync(
            `UPDATE suppliers SET name=?, email=?, age=?, gender=?, address=?, contact=? WHERE id=?`,
            [supplier.name, supplier.email, supplier.age, supplier.gender, supplier.address, supplier.contact, supplier.id]
        );
        
        return true;
    } catch (error) {
        console.error("Error updating supplier:", error);
        return false;
    }
}

async function deleteSupplier(id) {
    try {
        const db = await getDB();
        await db.runAsync(`DELETE FROM suppliers WHERE id=?`, [id]);
        return true;
    } catch (error) {
        console.error("Error deleting supplier:", error);
        return false;
    }
}

createSupplierTable().catch(err => console.error("Table creation error:", err));

export { saveSupplier, getSuppliers, updateSupplier, deleteSupplier, createSupplierTable };
