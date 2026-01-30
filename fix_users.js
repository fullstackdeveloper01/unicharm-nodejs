const sequelize = require('./config/database');
const fs = require('fs');

async function fixUsers() {
    let output = '';
    const log = (msg) => { console.log(msg); output += msg + '\n'; };

    try {
        log('--- Fixing Users for New Records ---');
        // Update records with ID >= 102 (our fixed ones) to have UserId = 1
        // Assuming ID 1 is a valid employee (confirmed by previous interaction)
        await sequelize.query("UPDATE meetingdetails SET UserId = 1 WHERE Id >= 102");
        log("Updated UserId to 1 for IDs >= 102");

    } catch (error) {
        log('Error: ' + error.message);
    } finally {
        fs.writeFileSync('fix_users_out.txt', output);
    }
}

fixUsers();
