const employeeService = require('./services/employeeService');

async function verify() {
    try {
        console.log("Verifying fix by calling employeeService.getAllEmployees()...");
        const result = await employeeService.getAllEmployees(1, 10);
        console.log(`Success! Retrieved ${result.count} employees.`);
        if (result.rows.length > 0) {
            console.log("Sample employee:", result.rows[0].Name);
        }
    } catch (error) {
        console.error("Verification Failed:", error);
    }
}

verify();
