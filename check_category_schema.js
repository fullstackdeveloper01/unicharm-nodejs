const db = require('./models');
async function check() {
    try {
        const [results] = await db.sequelize.query("DESCRIBE Categories");
        console.log("Categories Schema:", JSON.stringify(results, null, 2));
    } catch (e) { console.error(e); }
}
check();
