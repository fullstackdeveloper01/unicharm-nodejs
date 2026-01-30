const { MeetingRequest } = require('./models');

async function fixData() {
    try {
        await MeetingRequest.update(
            { UserId: 1 },
            { where: { Id: 100 } }
        );
        console.log('Updated Meeting 100 to have UserId 1');
    } catch (error) {
        console.error('Error:', error);
    }
}

fixData();
