const db = require('./models');

async function fixGroup() {
    try {
        await db.sequelize.authenticate();
        console.log("Connected.");

        // Add Members column
        try {
            await db.sequelize.query("ALTER TABLE `Group` ADD COLUMN Members LONGTEXT;");
            console.log("Added Members column.");
        } catch (e) {
            console.log("Error adding Members column (might exist?): " + e.message);
        }

        // Add PK if missing
        try {
            const [results] = await db.sequelize.query("DESCRIBE `Group`");
            const idCol = results.find(r => r.Field === 'Id');
            if (idCol && idCol.Key !== 'PRI') {
                console.log("Attempting to set Id as Primary Key...");
                await db.sequelize.query("ALTER TABLE `Group` MODIFY Id BIGINT AUTO_INCREMENT PRIMARY KEY;");
                console.log("Fixed Primary Key on Group.");
            } else {
                console.log("Id is already Primary Key or not found.");
            }
        } catch (e) {
            console.log("Error fixing PK: " + e.message);
        }

    } catch (e) {
        console.error("Fatal:", e);
    } finally {
        process.exit();
    }
}

fixGroup();
