const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'EMS_Admin_API.postman_collection.json');

try {
    const data = fs.readFileSync(collectionPath, 'utf8');
    const collection = JSON.parse(data);

    // Define the new Expense Locations folder and requests
    const expenseLocationFolder = {
        name: "Expense Locations",
        item: [
            {
                name: "Get All Expense Locations",
                request: {
                    method: "GET",
                    header: [],
                    url: {
                        raw: "{{base_url}}/api/expense-locations",
                        host: ["{{base_url}}"],
                        path: ["api", "expense-locations"]
                    },
                    description: "Get all expense locations"
                },
                response: []
            },
            {
                name: "Get Expense Location by ID",
                request: {
                    method: "GET",
                    header: [],
                    url: {
                        raw: "{{base_url}}/api/expense-locations/:id",
                        host: ["{{base_url}}"],
                        path: ["api", "expense-locations", ":id"],
                        variable: [{ key: "id", value: "1" }]
                    },
                    description: "Get expense location by ID"
                },
                response: []
            },
            {
                name: "Create Expense Location",
                request: {
                    method: "POST",
                    header: [{ key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            Title: "New Expense Location",
                            ZoneId: 1,
                            UnitId: 1
                        }, null, 2)
                    },
                    url: {
                        raw: "{{base_url}}/api/expense-locations",
                        host: ["{{base_url}}"],
                        path: ["api", "expense-locations"]
                    },
                    description: "Create a new expense location"
                },
                response: []
            },
            {
                name: "Update Expense Location",
                request: {
                    method: "PUT",
                    header: [{ key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            Title: "Updated Expense Location",
                            ZoneId: 1,
                            UnitId: 1
                        }, null, 2)
                    },
                    url: {
                        raw: "{{base_url}}/api/expense-locations/:id",
                        host: ["{{base_url}}"],
                        path: ["api", "expense-locations", ":id"],
                        variable: [{ key: "id", value: "1" }]
                    },
                    description: "Update an expense location"
                },
                response: []
            },
            {
                name: "Delete Expense Location",
                request: {
                    method: "DELETE",
                    header: [],
                    url: {
                        raw: "{{base_url}}/api/expense-locations/:id",
                        host: ["{{base_url}}"],
                        path: ["api", "expense-locations", ":id"],
                        variable: [{ key: "id", value: "1" }]
                    },
                    description: "Soft delete an expense location"
                },
                response: []
            }
        ]
    };

    // Check if Expense Locations folder already exists
    const existingIndex = collection.item.findIndex(item => item.name === "Expense Locations");
    if (existingIndex !== -1) {
        console.log("Expense Locations folder already exists. Updating it.");
        collection.item[existingIndex] = expenseLocationFolder;
    } else {
        console.log("Adding Expense Locations folder.");
        collection.item.push(expenseLocationFolder);
    }

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 4), 'utf8');
    console.log("Collection updated successfully.");

} catch (err) {
    console.error("Error updating collection:", err);
}
