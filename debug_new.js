const { MeetingRequest } = require('./models');
const fs = require('fs');

async function debugNewMeetings() {
    try {
        const meetings = await MeetingRequest.findAll({
            where: {
                Id: { [require('sequelize').Op.gt]: 100 }
            },
            raw: true
        });

        let output = '';
        if (meetings.length > 0) {
            output += `Found ${meetings.length} new meetings:\n`;
            meetings.forEach(m => {
                output += `ID: ${m.Id} | Date: '${m.Date}' | Time: ${m.TimeFrom}-${m.TimeTo} | User: ${m.UserId} | Loc: ${m.Location} Fl: ${m.Floor} Rm: ${m.Room}\n`;
            });
        } else {
            output = 'No meetings found with ID > 100';
        }

        fs.writeFileSync('debug_new_meetings.txt', output);

    } catch (error) {
        fs.writeFileSync('debug_new_meetings.txt', 'Error: ' + error.message);
    }
}

debugNewMeetings();
