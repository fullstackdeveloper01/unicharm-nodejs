const db = require('./models');
const { Employee } = db;

async function checkData() {
    try {
        const emps = await Employee.findAll({ limit: 5 });
        console.log(JSON.stringify(emps, null, 2));
    } catch (e) {
        console.error(e);
    }
}
checkData();
