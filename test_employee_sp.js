const storedProcedureService = require('./services/storedProcedureService');

async function testSP() {
    try {
        const result = await storedProcedureService.getEmployeesList();
        console.log('Result count:', result.length);
        if (result.length > 0) {
            console.log('Sample:', JSON.stringify(result[0], null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}
testSP();
