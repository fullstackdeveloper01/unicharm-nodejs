const { checkLogin } = require('./services/storedProcedureService');
const db = require('./models');

async function test() {
    try {
        await db.sequelize.authenticate();
        console.log("DB Connected");
        const result = await checkLogin('takaku-k@unicharm.com', 'ken3010088');
        console.log("Result type:", typeof result);
        console.log("Result isArray:", Array.isArray(result));
        console.log("Result content:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

test();
