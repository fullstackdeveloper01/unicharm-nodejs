const db = require('./models');
const { sequelize } = db;

async function checkMissingTables() {
    try {
        await sequelize.authenticate();

        // Get all defined model names and their corresponding table names
        const definedModels = Object.keys(db).filter(key =>
            key !== 'sequelize' && key !== 'Sequelize'
        );

        const expectedTables = [];
        definedModels.forEach(modelName => {
            if (db[modelName].tableName) {
                expectedTables.push({
                    model: modelName,
                    table: db[modelName].tableName
                });
            }
        });

        // Get actual tables in the database
        const [results] = await sequelize.query("SHOW TABLES");
        const existingTables = results.map(row => Object.values(row)[0]);

        const missingTables = expectedTables.filter(t => !existingTables.includes(t.table));

        if (missingTables.length > 0) {
            console.log('MISSING TABLES:');
            missingTables.forEach(t => {
                console.log(`- Model: ${t.model} -> Table: ${t.table}`);
            });
        } else {
            console.log('No missing tables found. All models have corresponding tables.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking tables:', error);
        process.exit(1);
    }
}

checkMissingTables();
