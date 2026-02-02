const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'EMS_Admin_API.postman_collection.json');

try {
    const data = fs.readFileSync(collectionPath, 'utf8');
    const collection = JSON.parse(data);

    const messageFolder = collection.item.find(item => item.name === "Messages");

    if (messageFolder) {
        // Update Create Message
        const createReq = messageFolder.item.find(i => i.name === "Create Message");
        if (createReq) {
            createReq.request.body.raw = JSON.stringify({
                Title: "New Message Title",
                Quote: "Content of the message quote",
                RoleId: 1,
                AddedBy: 1
            }, null, 2);
        }

        // Update Update Message
        const updateReq = messageFolder.item.find(i => i.name === "Update Message");
        if (updateReq) {
            updateReq.request.body.raw = JSON.stringify({
                Title: "Updated Message Title",
                Quote: "Updated content of the message quote",
                RoleId: 2,
                AddedBy: 1
            }, null, 2);
        }

        console.log("Updated Message request bodies.");
        fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 4), 'utf8');
    } else {
        console.log("Messages folder not found.");
    }

} catch (err) {
    console.error("Error updating collection:", err);
}
