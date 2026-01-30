const db = require('./models');
const { Department } = db;

async function check() {
    try {
        console.log("Fetching one department...");
        const dept = await Department.findOne();
        if (dept) {
            console.log('Department Record:', JSON.stringify(dept.toJSON(), null, 2));
        } else {
            console.log("No departments found.");
        }
    } catch (e) {
        console.error("Error fetching department:", e);
    }
}

check();
