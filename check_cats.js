const db = require('./models');
async function check() {
    try {
        const cats = await db.Category.findAll();
        console.log(JSON.stringify(cats, null, 2));
    } catch (e) { console.error(e); }
}
check();
