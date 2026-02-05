const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDatabase() {
    console.log('---------------------------------------------------');
    console.log('       ULTIMATE SALES PRICE POLICY FIXER           ');
    console.log('---------------------------------------------------');

    let connection;
    try {
        // 1. Connection Config
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'unicharm_db'
        };

        console.log(`Connecting to: ${dbConfig.host} / ${dbConfig.database} as ${dbConfig.user}`);
        connection = await mysql.createConnection(dbConfig);
        console.log('✓ Connected successfully');

        const tableName = 'SalesPricePolicy';

        // 2. Check if table exists
        const [tables] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length === 0) {
            console.error(`❌ CRITICAL: Table '${tableName}' does not exist!`);
            return;
        }
        console.log(`✓ Table '${tableName}' exists`);

        // 3. Get Current Columns
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        const existingColumnNames = columns.map(c => c.Field);

        console.log(`\nCurrent Columns (${existingColumnNames.length}):`);
        console.log(existingColumnNames.join(', '));

        // 4. Define Expected Columns (Based on Model)
        const expectedColumns = [
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

        // 5. Fix Missing Columns
        console.log('\n--- Checking for Missing Columns ---');
        let changesMade = false;

        for (const col of expectedColumns) {
            if (!existingColumnNames.includes(col.name)) {
                console.log(`⚠️  MISSING: ${col.name}`);
                try {
                    const query = `ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type} NULL`;
                    console.log(`   Executing: ${query}`);
                    await connection.query(query);
                    console.log(`   ✓ Added ${col.name}`);
                    changesMade = true;
                } catch (err) {
                    console.error(`   ❌ Failed to add ${col.name}: ${err.message}`);
                }
            } else {
                // Column exists, verify type if needed (optional)
                // console.log(`   OK: ${col.name}`);
            }
        }

        if (!changesMade) {
            console.log('✓ No missing columns found. The schema looks correct.');
        } else {
            console.log('\n✓ Successfully added missing columns.');
        }

        // 6. Final Verification
        console.log('\n--- Final Verification ---');
        const [finalColumns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        const finalNames = finalColumns.map(c => c.Field);

        const stillMissing = expectedColumns.filter(c => !finalNames.includes(c.name));
        if (stillMissing.length > 0) {
            console.error('❌ ERROR: Some columns are STILL missing:', stillMissing.map(c => c.name).join(', '));
        } else {
            console.log('✓ ALL expected columns are present.');
        }

    } catch (error) {
        console.error('\n❌ SCRIPT ERROR:', error.message);
    } finally {
        if (connection) await connection.end();
        console.log('\n---------------------------------------------------');
    }
}

fixDatabase();
