const db = require('./models');
const { Employee, Department, Designation, Role, Unit, Zone, Location } = db;
const { Op } = require('sequelize');

async function test() {
    try {
        console.log("Starting test...");

        const filters = {
            // Simulate typical filters, trying empty first
        };

        const pageNumber = 1;
        const limitNumber = 10;

        const whereClause = {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        };

        // Try adding the suspicious filter that might be causing issues if present
        // But let's start without it to see if basic fetch works

        const queryOptions = {
            where: whereClause,
            include: [
                { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] },
                { model: Designation, as: 'designation', attributes: ['Id', 'DesignationName'] },
                { model: Role, as: 'role', attributes: ['Id', 'RoleName'] },
            ],
            order: [['CreatedOn', 'DESC']],
            limit: limitNumber,
            offset: 0
        };

        console.log("Executing query...");
        const { count, rows } = await Employee.findAndCountAll(queryOptions);
        console.log(`Success! Found ${count} employees.`);

    } catch (error) {
        console.error("Caught Error:");
        console.error(error);
    }
}

test();
