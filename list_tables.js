const sequelize = require('./config/database');

async function listTables() {
    try {
        await sequelize.authenticate();
        console.log('Connected to ' + sequelize.config.database);
        const [results] = await sequelize.query('SHOW TABLES');
        console.log('Tables:', results.map(r => Object.values(r)[0]));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

listTables();
