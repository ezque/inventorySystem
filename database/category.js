import getDB from './database';


async function createCategoryTable() {
    const db = await getDB();    
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT
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


async function saveCategory({ name, description }) {
    try {
        const db = await getDB();
        await db.runAsync(
            `INSERT INTO categories (name, description) VALUES (?, ?)`,
            [name, description]
        );
        return { success: true, message: "Category added successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getCategories() {
    try {
        const db = await getDB();
        const results = await db.getAllAsync(`SELECT * FROM categories`);
        return results;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

async function updateCategory(category) {
    try {
        const db = await getDB();
        await db.runAsync(
            `UPDATE categories SET name=?, description=? WHERE id=?`,
            [category.name, category.description, category.id]
        );
        return true;
    } catch (error) {
        console.error("Error updating category:", error);
        return false;
    }
}

async function deleteCategory(id) {
    try {
        const db = await getDB();
        await db.runAsync(`DELETE FROM categories WHERE id=?`, [id]);
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        return false;
    }
}

createCategoryTable();

export { saveCategory, getCategories, updateCategory, deleteCategory, createCategoryTable };