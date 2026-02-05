const db = require('./models');

async function fixSchema() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();

        const queryInterface = db.sequelize.getQueryInterface();
        const tableName = 'SalesPricePolicy';

        const columnsToAdd = [
            { name: 'ExHqDaTtMt', type: 'VARCHAR(255)' },
            { name: 'ExHqDaInstitution', type: 'VARCHAR(255)' },
            { name: 'FoodHqDa', type: 'VARCHAR(255)' },
            { name: 'FoodMetroOutstation', type: 'VARCHAR(255)' },
            { name: 'PhoneCalls', type: 'VARCHAR(255)' },
            { name: 'PhoneInternet', type: 'VARCHAR(255)' },
            { name: 'Courier', type: 'VARCHAR(255)' },
            { name: 'Stationary', type: 'VARCHAR(255)' },
            { name: 'LodgingMetro', type: 'VARCHAR(255)' },
            { name: 'LodgingNonMetro', type: 'VARCHAR(255)' },
            { name: 'LodgingWithoutBill', type: 'VARCHAR(255)' },
            { name: 'PetrolMetro', type: 'VARCHAR(255)' },
            { name: 'PetrolNonMetro', type: 'VARCHAR(255)' },
            { name: 'TollParking', type: 'VARCHAR(255)' },
            { name: 'MeetingDescription', type: 'VARCHAR(255)' },
            { name: 'MeetingEligibility', type: 'VARCHAR(255)' },
            { name: 'MaxDaysHqDa', type: 'VARCHAR(255)' },
            { name: 'MaxDaysExHqDa', type: 'VARCHAR(255)' },
            { name: 'MaxDaysOutstation', type: 'VARCHAR(255)' }
        ];

        // Get current columns
        const [results] = await db.sequelize.query(`SHOW COLUMNS FROM ${tableName}`);
        const existingColumns = results.map(c => c.Field);

        console.log('Existing columns:', existingColumns);

        for (const col of columnsToAdd) {
            if (!existingColumns.includes(col.name)) {
                console.log(`Adding missing column: ${col.name}`);
                await db.sequelize.query(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type} NULL`);
            } else {
                console.log(`Column ${col.name} already exists. Skipping.`);
            }
        }

        // Also fix types of existing columns to be VARCHAR to support 'Actual' etc.
        const columnsToModify = [
            'HqDaMetro', 'HqDaNonMetro', 'ExHqDaMetro', 'ExHqDaNonMetro',
            'UpcountryMetro', 'UpcountryNonMetro', 'LodgingAndBoarding'
        ];

        for (const colName of columnsToModify) {
            if (existingColumns.includes(colName)) {
                console.log(`Ensuring ${colName} is VARCHAR(255)...`);
                await db.sequelize.query(`ALTER TABLE ${tableName} MODIFY COLUMN ${colName} VARCHAR(255) NULL`);
            }
        }

        console.log('Schema fix completed.');

    } catch (error) {
        console.error('Error fixing schema:', error);
    } finally {
        await db.sequelize.close();
        process.exit(0);
    }
}

fixSchema();
