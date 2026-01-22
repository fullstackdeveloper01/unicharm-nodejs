const service = require('./services/meetingRequestService');
const db = require('./models');

async function test() {
    try {
        console.log("Fetching Meeting Requests...");
        const requests = await service.getAllRequests();
        console.log(`Count: ${requests.length}`);

        if (requests.length > 0) {
            const r = requests[0];
            console.log("First Request:", JSON.stringify(r, null, 2));

            // Check raw values
            const rawReq = await db.MeetingRequest.findOne({
                where: { Id: r.Id },
                include: [{ model: db.Employee, as: 'bookedBy' }]
            });
            console.log("Raw BookedBy Dept ID:", rawReq.bookedBy ? rawReq.bookedBy.DepartmentId : 'None');
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
