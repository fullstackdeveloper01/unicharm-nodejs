const db = require('./models');
const { Employee, Op } = db;

async function findWeird() {
    try {
        const emps = await Employee.findAll({
            where: {
                FirstName: { [db.Sequelize.Op.like]: 'Employee%' }
            },
            limit: 10
        });
        console.log('Found weird employees:', emps.length);
        if (emps.length > 0) {
            console.log(JSON.stringify(emps[0], null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}
findWeird();
