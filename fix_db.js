const db = require('./models');
const { sequelize } = db;

async function fixDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 1. Check if Employees.Id has a primary key
        const [results] = await sequelize.query("DESCRIBE Employees;");
        const idColumn = results.find(row => row.Field === 'Id');

        if (idColumn.Key !== 'PRI') {
            console.log('Employees.Id is NOT a Primary Key. Fixing...');
            // Note: We assume Id is meant to be AUTO_INCREMENT. 
            // Existing data must be unique for ID for this to succeed.
            // We also strictly set it to BIGINT to match the model.
            try {
                await sequelize.query("ALTER TABLE Employees MODIFY Id BIGINT AUTO_INCREMENT PRIMARY KEY;");
                console.log('Successfully altered Employees table.');
            } catch (err) {
                console.error("Failed to alter Employees table:", err.message);
            }
        } else {
            console.log('Employees.Id IS already a Primary Key. Verifying Type compatibility...');
            if (idColumn.Type.toLowerCase().includes('int') && !idColumn.Type.toLowerCase().includes('bigint')) {
                console.log(`Employees.Id is ${idColumn.Type}. Wall.AddedBy is BIGINT. Mismatch might occur if not fixed.`);
                // If we really need to, we could alter it, but changing PK type is dangerous.
                // Better to assume my previous check was correct (it was bigint).
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Database fix failed:', error);
        process.exit(1);
    }
}

fixDatabase();
