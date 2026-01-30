const { sequelize } = require('./models');

async function test() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SELECT * FROM Employees LIMIT 1");
        console.log("User found:", results);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

test();
