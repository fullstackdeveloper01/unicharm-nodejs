const db = require('./models');
async function check() {
    const [results] = await db.sequelize.query("SHOW TABLES LIKE '%Meeting%'");
    console.log("Tables:", JSON.stringify(results, null, 2));
}
check();
