const db = require('./models');
const { Employee, Op } = db;

async function check51969() {
    try {
        const byId = await Employee.findByPk(51969);
        console.log('By ID 51969:', byId ? JSON.stringify(byId.toJSON(), null, 2) : 'Not Found');

        const byEmpId = await Employee.findOne({ where: { EmpId: '51969' } });
        console.log('By EmpId 51969:', byEmpId ? JSON.stringify(byEmpId.toJSON(), null, 2) : 'Not Found');
    } catch (e) {
        console.error(e);
    }
}
check51969();
