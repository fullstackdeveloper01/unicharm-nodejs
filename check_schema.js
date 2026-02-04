const db = require('./models');
const { sequelize } = db;

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const [results] = await sequelize.query("DESCRIBE Employees;");
        const idColumn = results.find(row => row.Field === 'Id');
        console.log('Employees.Id Schema:', idColumn);

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

checkSchema();
