import getDB from './database';

async function createProductTable() {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    price INTEGER,
                    quantity INTEGER,
                    image TEXT,
                    expiry_date TEXT,
                    category_id INTEGER,
                    supplier_id INTEGER,
                );`,
                [],
                () => {
                    resolve(true);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
}


async function saveProduct({ name, description, price, quantity, image, expiry_date, category_id, supplier_id }) {
    try {
        const db = await getDB();
        await db.runAsync(
            `INSERT INTO products (name, description, price, quantity, image, expiry_date, category_id, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, price, quantity, image, expiry_date, category_id, supplier_id]
        );
        return { success: true, message: "Product added successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getProducts() {
    try {
        const db = await getDB();
        const results = await db.getAllAsync(
            `SELECT products.*, categories.name AS category_name, suppliers.name AS supplier_name
             FROM products
             LEFT JOIN categories ON products.category_id = categories.id
             LEFT JOIN suppliers ON products.supplier_id = suppliers.id`
        );
        return results;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}


async function updateProduct(product) {
    try {
        const db = await getDB();
        await db.runAsync(
            `UPDATE products SET name=?, description=?, price=?, quantity=?, image=?, expiry_date=?, category_id=?, supplier_id=? WHERE id=?`,
            [product.name, product.description, product.price, product.quantity, product.image, product.expiry_date, product.category_id, product.supplier_id, product.id]
        );
        
        return true;
    } catch (error) {
        console.error("Error updating product:", error);
        return false;
    }
}

async function deleteProduct(id) {
    try {
        const db = await getDB();
        await db.runAsync(`DELETE FROM products WHERE id=?`, [id]);
        return true;
    } catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }
}

createProductTable();

export { saveProduct, getProducts, updateProduct, deleteProduct, createProductTable };