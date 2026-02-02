const db = require('./models');

async function check() {
    try {
        // Raw query to describe table
        const [results] = await db.sequelize.query("DESCRIBE MeetingNotifications");
        console.log("Table Columns:", JSON.stringify(results, null, 2));
    } catch (e) {
        console.error("Error:", e);
        // Maybe table name is singular?
        try {
            const [results] = await db.sequelize.query("DESCRIBE MeetingNotification");
            console.log("Table Columns (Singular):", JSON.stringify(results, null, 2));
        } catch (e2) {
            console.error("Error Singular:", e2);
        }
    }
}
check();
