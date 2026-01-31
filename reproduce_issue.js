const employeeService = require('./services/employeeService');

async function test() {
    try {
        console.log("Calling getAllEmployees...");
        // Mock filters
        const result = await employeeService.getAllEmployees(1, 10, {});
        console.log("Success! Count:", result.count);
        console.log("First row Unit:", result.rows[0]?.Unit);
        process.exit(0);
    } catch (e) {
        console.error("Caught Error:");
        console.error(e.message);
        if (e.original) console.error("Original Error:", e.original.sqlMessage || e.original);
        process.exit(1);
    }
}
test();
