const { sequelize } = require('./models');

async function test() {
    try {
        await sequelize.authenticate();
        // Mimic the service call exactly
        const query = "CALL USP_CheckLogin(:Email, :Password)";
        const results = await sequelize.query(query, {
            replacements: { Email: 'takaku-k@unicharm.com', Password: 'ken3010088' },
            type: sequelize.QueryTypes.SELECT
        });

        console.log("Raw results type:", typeof results);
        console.log("Raw results isArray:", Array.isArray(results));
        console.log("Raw results content:", JSON.stringify(results, null, 2));

        // Mimic service unwrapping
        const final = Array.isArray(results) && results.length > 0 ? results[0] : results;
        console.log("Service returns:", JSON.stringify(final, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

test();
