const { MeetingRequest } = require('./models');
const { Op } = require('sequelize');
const sequelize = require('./config/database');

async function fixIds() {
    try {
        console.log('--- Fixing Missing IDs ---');

        // 1. Get current Max ID
        const maxResult = await MeetingRequest.findOne({
            order: [['Id', 'DESC']],
            attributes: ['Id']
        });
        let nextId = (maxResult && maxResult.Id) ? parseInt(maxResult.Id) + 1 : 1;
        console.log('Current Max ID:', maxResult ? maxResult.Id : 'None', 'Next ID:', nextId);

        if (!maxResult || !maxResult.Id) {
            console.log("Strange, no max ID found but we saw 101 in list (maybe those 0s are confusing sort). forcing 102.");
            nextId = 102;
        }

        // 2. Find rows with missing/zero IDs.
        // Sequelize might return them as null Id? Or we search raw.
        // Since Id is PK in model, findOne might be tricky if it relies on ID.
        // Using raw query is safer to find headers 0.
        const [results] = await sequelize.query("SELECT * FROM meetingdetails WHERE Id = 0 OR Id IS NULL");

        console.log(`Found ${results.length} records with invalid ID.`);

        for (const row of results) {
            // Need to update this specific row. Since Id is 0, we can't use WHERE Id=0 effectively if there are multiple.
            // We can use other unique columns? CreatedOn is likely unique enough for this fix.
            // Or use LIMIT 1.
            const dateStr = row.CreatedOn; // assume unique enough
            console.log(`Updating row with CreatedOn ${dateStr} to ID ${nextId}`);

            // Raw update to avoid Sequelize model issues with PK change
            await sequelize.query(
                `UPDATE meetingdetails SET Id = ${nextId} WHERE CreatedOn = '${dateStr}' AND (Id = 0 OR Id IS NULL) LIMIT 1`
            );
            nextId++;
        }

        console.log("IDs fixed. Now attempting to enable AUTO_INCREMENT...");

        // 3. Enable Auto Increment
        try {
            await sequelize.query("ALTER TABLE meetingdetails MODIFY COLUMN Id BIGINT AUTO_INCREMENT");
            console.log("AUTO_INCREMENT enabled successfully!");
        } catch (alterError) {
            console.error("Failed to enable AUTO_INCREMENT (might require PK constraint check):", alterError.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

fixIds();
