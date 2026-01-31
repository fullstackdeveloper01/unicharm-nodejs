const { MeetingRequest } = require('./models');
const { Op } = require('sequelize');
const sequelize = require('./config/database');
const fs = require('fs');

async function fixIds() {
    let output = '';
    const log = (msg) => { console.log(msg); output += msg + '\n'; };

    try {
        log('--- Fixing Missing IDs ---');

        const maxResult = await MeetingRequest.findOne({
            order: [['Id', 'DESC']],
            attributes: ['Id']
        });
        let nextId = (maxResult && maxResult.Id) ? parseInt(maxResult.Id) + 1 : 1;
        log(`Current Max ID: ${maxResult ? maxResult.Id : 'None'}. Next ID: ${nextId}`);

        if ((!maxResult || !maxResult.Id) && nextId === 1) {
            // If maxResult is 0?
            nextId = 102;
        }

        const [results] = await sequelize.query("SELECT * FROM meetingdetails WHERE Id = 0 OR Id IS NULL");

        log(`Found ${results.length} records with invalid ID.`);

        for (const row of results) {
            const dateStr = row.CreatedOn; // using CreatedOn as literal string
            // MySQL DateTime format string 'YYYY-MM-DD HH:mm:ss'
            log(`Updating row with CreatedOn "${dateStr}" to ID ${nextId}`);

            // Note: dateStr might need quotes
            await sequelize.query(
                `UPDATE meetingdetails SET Id = ${nextId} WHERE CreatedOn = '${dateStr}' AND (Id = 0 OR Id IS NULL) LIMIT 1`
            );
            nextId++;
        }

        log("IDs fixed. Now attempting to enable AUTO_INCREMENT...");

        try {
            await sequelize.query("ALTER TABLE meetingdetails MODIFY COLUMN Id BIGINT AUTO_INCREMENT");
            log("AUTO_INCREMENT enabled successfully!");
        } catch (alterError) {
            log("Failed to enable AUTO_INCREMENT: " + alterError.message);
        }

    } catch (error) {
        log('Error: ' + error.message);
    } finally {
        fs.writeFileSync('fix_ids_out.txt', output);
    }
}

fixIds();
