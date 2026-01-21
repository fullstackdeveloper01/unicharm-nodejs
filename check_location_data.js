const db = require('./models');

async function check() {
    try {
        console.log("Checking Location Table...");
        const locations = await db.Location.findAll();
        console.log(`Location Count: ${locations.length}`);
        if (locations.length > 0) {
            console.log("Locations:", JSON.stringify(locations, null, 2));
        } else {
            console.log("Location table is EMPTY.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
check();
