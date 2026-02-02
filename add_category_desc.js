const db = require('./models');

async function updateSchema() {
    try {
        console.log("Adding Description column to Categories table...");
        await db.sequelize.query("ALTER TABLE Categories ADD COLUMN Description TEXT");
        console.log("Column added.");
    } catch (e) {
        console.error("Error (might already exist or other):", e.message);
    }
}
updateSchema();
