const db = require('./models');

async function check() {
    try {
        console.log("Checking Floor Table...");
        const floors = await db.Floor.findAll();
        console.log(`Floor Count: ${floors.length}`);
        if (floors.length > 0) {
            console.log("First 3 Floors:", JSON.stringify(floors.slice(0, 3), null, 2));
        }

        console.log("\nChecking Room Table...");
        // Use raw query to check actual data in 'Floor' column if possible, 
        // or just use model.
        // We'll use model first.
        const rooms = await db.Room.findAll({ limit: 3 });
        console.log(`First 3 Rooms:`, JSON.stringify(rooms, null, 2));

        // Let's check Schema via describe if possible (Sequelize doesn't show raw values easily if type mismatch).
        // Try raw query.
        const [results] = await db.sequelize.query("SELECT * FROM Room LIMIT 3");
        console.log("\nRaw Room Data (first 3):", JSON.stringify(results, null, 2));

        const [floorResults] = await db.sequelize.query("SELECT * FROM Floor LIMIT 3");
        console.log("\nRaw Floor Data (first 3):", JSON.stringify(floorResults, null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
}
check();
