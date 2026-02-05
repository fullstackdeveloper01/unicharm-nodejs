const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixLiveSchema() {
    let connection;
    try {
        // Create connection using environment variables
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'unicharm_db'
        });

        console.log('Connected to database:', process.env.DB_NAME);

        const tableName = 'SalesPricePolicy';

        // Check existing columns
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        const existingColumns = columns.map(c => c.Field);

        console.log('Existing columns:', existingColumns.join(', '));

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

        let addedCount = 0;
        for (const col of columnsToAdd) {
            if (!existingColumns.includes(col.name)) {
                console.log(`Adding column: ${col.name}`);
                await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type} NULL`);
                addedCount++;
            } else {
                console.log(`Column ${col.name} already exists`);
            }
        }

        // Also ensure existing columns are VARCHAR
        const columnsToModify = [
            'HqDaMetro', 'HqDaNonMetro', 'ExHqDaMetro', 'ExHqDaNonMetro',
            'UpcountryMetro', 'UpcountryNonMetro', 'LodgingAndBoarding'
        ];

        for (const colName of columnsToModify) {
            if (existingColumns.includes(colName)) {
                console.log(`Ensuring ${colName} is VARCHAR(255)...`);
                await connection.query(`ALTER TABLE ${tableName} MODIFY COLUMN ${colName} VARCHAR(255) NULL`);
            }
        }

        console.log(`\n✓ Schema update complete! Added ${addedCount} new columns.`);
        console.log('You can now restart your PM2 process: pm2 restart 0');

    } catch (error) {
        console.error('Error fixing schema:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit(0);
    }
}

fixLiveSchema();
