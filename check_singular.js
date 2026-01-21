const db = require('./models');
async function check() {
    const [results] = await db.sequelize.query("DESCRIBE MeetingNotification");
    console.log("Singular Table Columns:", JSON.stringify(results, null, 2));
}
check();
