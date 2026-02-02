const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'EMS_Admin_API.postman_collection.json');

try {
    const data = fs.readFileSync(collectionPath, 'utf8');
    const collection = JSON.parse(data);

    // Define the new Message folder and requests
    const messageFolder = {
        name: "Messages",
        item: [
            {
                name: "Get All Messages",
                request: {
                    method: "GET",
                    header: [],
                    url: {
                        raw: "{{base_url}}/api/messages",
                        host: ["{{base_url}}"],
                        path: ["api", "messages"]
                    },
                    description: "Get all messages"
                },
                response: []
            },
            {
                name: "Get Message by ID",
                request: {
                    method: "GET",
                    header: [],
                    url: {
                        raw: "{{base_url}}/api/messages/:id",
                        host: ["{{base_url}}"],
                        path: ["api", "messages", ":id"],
                        variable: [{ key: "id", value: "1" }]
                    },
                    description: "Get message by ID"
                },
                response: []
            },
            {
                name: "Create Message",
                request: {
                    method: "POST",
                    header: [{ key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            Subject: "New Message",
                            MessageText: "Content of the message"
                        }, null, 2)
                    },
                    url: {
                        raw: "{{base_url}}/api/messages",
                        host: ["{{base_url}}"],
                        path: ["api", "messages"]
                    },
                    description: "Create a new message"
                },
                response: []
            },
            {
                name: "Update Message",
                request: {
                    method: "PUT",
                    header: [{ key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            Subject: "Updated Message",
                            MessageText: "Updated content"
                        }, null, 2)
                    },
                    url: {
                        raw: "{{base_url}}/api/messages/:id",
                        host: ["{{base_url}}"],
                        path: ["api", "messages", ":id"],
                        variable: [{ key: "id", value: "1" }]
                    },
                    description: "Update a message"
                },
                response: []
            },
            {
                name: "Delete Message",
                request: {
                    method: "DELETE",
                    header: [],
                    url: {
                        raw: "{{base_url}}/api/messages/:id",
                        host: ["{{base_url}}"],
                        path: ["api", "messages", ":id"],
                        variable: [{ key: "id", value: "1" }]
                    },
                    description: "Soft delete a message"
                },
                response: []
            }
        ]
    };

    // Check if Messages folder already exists
    const existingIndex = collection.item.findIndex(item => item.name === "Messages");
    if (existingIndex !== -1) {
        console.log("Messages folder already exists. Updating it.");
        collection.item[existingIndex] = messageFolder;
    } else {
        console.log("Adding Messages folder.");
        collection.item.push(messageFolder);
    }

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 4), 'utf8');
    console.log("Collection updated successfully.");

} catch (err) {
    console.error("Error updating collection:", err);
}
