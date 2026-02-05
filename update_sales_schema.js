const db = require('./models');

async function updateSchema() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Connection successful.');

        console.log('Updating SalesPricePolicy schema...');
        // Sync only the SalesPricePolicy model with alter: true to add missing columns
        await db.SalesPricePolicy.sync({ alter: true });
        console.log('SalesPricePolicy schema updated successfully.');

    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        try {
            await db.sequelize.close();
        } catch (e) {
            // ignore close error
        }
        process.exit(0);
    }
}

updateSchema();
