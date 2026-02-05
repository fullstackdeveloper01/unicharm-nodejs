const db = require('./models');

async function checkSchema() {
    try {
        const [results, metadata] = await db.sequelize.query("DESCRIBE `Group`");
        console.log("Columns in Group table:");
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        // Try without backticks if case sensitivity or sql mode differs, though Describe Group usually needs backticks if reserved (Group is reserved in some SQL)
        try {
            const [results2] = await db.sequelize.query("DESCRIBE Group");
            console.log("Columns in Group table (no backticks):");
            console.log(JSON.stringify(results2, null, 2));
        } catch (err2) {
            console.error("Error describing group table:", error.message);
        }
    } finally {
        process.exit();
    }
}

checkSchema();
