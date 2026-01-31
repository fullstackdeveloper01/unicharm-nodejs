const { MeetingRequest } = require('./models');
const fs = require('fs');

async function debugNewDetails() {
    try {
        const meetings = await MeetingRequest.findAll({
            where: {
                Id: { [require('sequelize').Op.gt]: 100 }
            },
            raw: true
        });

        const output = JSON.stringify(meetings, null, 2);
        fs.writeFileSync('debug_new_full.txt', output);

    } catch (error) {
        fs.writeFileSync('debug_new_full.txt', 'Error: ' + error.message);
    }
}

debugNewDetails();
