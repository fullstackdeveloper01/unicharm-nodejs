const service = require('./services/meetingRequestService');
async function test() {
    const requests = await service.getAllRequests();
    if (requests.length > 0) {
        console.log(JSON.stringify(requests[0]));
    }
}
test();
