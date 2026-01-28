const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'EMS_Admin_API.postman_collection.json');

try {
    const data = fs.readFileSync(collectionPath, 'utf8');
    const collection = JSON.parse(data);

    // Define the new Auth folder and requests
    const authFolder = {
        name: "Authentication",
        item: [
            {
                name: "Login (Employee)",
                request: {
                    method: "POST",
                    header: [{ key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            email: "john.doe@example.com",
                            password: "password123",
                            type: "employee"
                        }, null, 2)
                    },
                    url: {
                        raw: "{{base_url}}/api/auth/login",
                        host: ["{{base_url}}"],
                        path: ["api", "auth", "login"]
                    },
                    description: "Login for employees"
                },
                response: []
            },
            {
                name: "Login (Accountant)",
                request: {
                    method: "POST",
                    header: [{ key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            email: "admin_user",
                            password: "adminpassword",
                            type: "accountant"
                        }, null, 2)
                    },
                    url: {
                        raw: "{{base_url}}/api/auth/login",
                        host: ["{{base_url}}"],
                        path: ["api", "auth", "login"]
                    },
                    description: "Login for accountants (use username in email field)"
                },
                response: []
            },
            {
                name: "Get Current User (Protected)",
                request: {
                    method: "GET",
                    header: [
                        { key: "Authorization", value: "Bearer <token>" }
                    ],
                    url: {
                        raw: "{{base_url}}/api/auth/me",
                        host: ["{{base_url}}"],
                        path: ["api", "auth", "me"]
                    },
                    description: "Get current authenticated user info"
                },
                response: []
            }
        ]
    };

    // Check if Auth folder already exists
    const existingIndex = collection.item.findIndex(item => item.name === "Authentication");
    if (existingIndex !== -1) {
        console.log("Authentication folder already exists. Updating it.");
        collection.item[existingIndex] = authFolder;
    } else {
        console.log("Adding Authentication folder.");
        // Add to the beginning of the collection for visibility
        collection.item.unshift(authFolder);
    }

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 4), 'utf8');
    console.log("Collection updated successfully.");

} catch (err) {
    console.error("Error updating collection:", err);
}
