const sequelize = require('./config/database');
const fs = require('fs');

async function fixPkAi() {
    let output = '';
    const log = (msg) => { console.log(msg); output += msg + '\n'; };

    try {
        log('--- Fixing PK and AI ---');

        // 1. Try to Add Primary Key
        try {
            log("Attempting to ADD PRIMARY KEY (Id)...");
            await sequelize.query("ALTER TABLE meetingdetails ADD PRIMARY KEY (Id)");
            log("PRIMARY KEY added successfully!");
        } catch (error) {
            log("ADD PRIMARY KEY failed (maybe already exists?): " + error.message);
        }

        // 2. Try to Enable Auto Increment
        try {
            log("Attempting to ENABLE AUTO_INCREMENT...");
            await sequelize.query("ALTER TABLE meetingdetails MODIFY COLUMN Id BIGINT AUTO_INCREMENT");
            log("AUTO_INCREMENT enabled successfully!");
        } catch (error) {
            log("ENABLE AUTO_INCREMENT failed: " + error.message);
        }

    } catch (error) {
        log('Global Error: ' + error.message);
    } finally {
        fs.writeFileSync('fix_pk_ai_out.txt', output);
    }
}

fixPkAi();
