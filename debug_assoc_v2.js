const db = require('./models');
const { Employee, Unit } = db;

async function debugAssoc() {
    try {
        console.log("=== Debugging Employee Associations ===");
        const assocNames = Object.keys(Employee.associations);
        console.log("Associations on Employee:", assocNames);

        if (Employee.associations.unitDetails) {
            console.log("SUCCESS: 'unitDetails' association exists.");
            console.log("Association Target:", Employee.associations.unitDetails.target.name);
        } else {
            console.error("FAILURE: 'unitDetails' association MISSING.");
        }

        if (Employee.associations.unit) {
            console.log("WARNING: 'unit' association (old) still exists!");
        }

        console.log("Checking for Unit model validity...");
        if (!Unit) {
            console.error("Unit model is undefined!");
        } else {
            console.log("Unit model is defined. Table:", Unit.tableName);
        }

        process.exit(0);
    } catch (e) {
        console.error("Error during debug:", e);
        process.exit(1);
    }
}
debugAssoc();
