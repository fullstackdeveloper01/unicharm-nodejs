const fs = require('fs');
const path = require('path');

const collectionPath = path.join(__dirname, 'Employee_App_Postman_Collection.json');

try {
    const data = fs.readFileSync(collectionPath, 'utf8');
    const collection = JSON.parse(data);

    const ticketFolder = {
        name: "Ticket Module",
        item: [
            {
                name: "1. My Ticket Summary",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/my-summary",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "my-summary"]
                    }
                }
            },
            {
                name: "2. My Ticket List",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/my-list?page=1&limit=10&status=Open&search=&sortBy=CreatedOn&sortOrder=DESC",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "my-list"],
                        query: [
                            { key: "page", value: "1" },
                            { key: "limit", value: "10" },
                            { key: "status", value: "Open" },
                            { key: "search", value: "" },
                            { key: "sortBy", value: "CreatedOn" },
                            { key: "sortOrder", value: "DESC" }
                        ]
                    }
                }
            },
            {
                name: "3. Ticket Details",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/details/1",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "details", "1"]
                    }
                }
            },
            {
                name: "4. Get Dropdowns (Region)",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/dropdowns?type=Region",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "dropdowns"],
                        query: [{ key: "type", value: "Region" }]
                    }
                }
            },
            {
                name: "5. Create Ticket (Form Data)",
                request: {
                    method: "POST",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    body: {
                        mode: "formdata",
                        formdata: [
                            { key: "RegionId", value: "1", type: "text" },
                            { key: "CityId", value: "1", type: "text" },
                            { key: "AssigneeId", value: "2", type: "text" },
                            { key: "CategoryId", value: "4", type: "text" },
                            { key: "PriorityId", value: "1", type: "text" },
                            { key: "MobileNumber", value: "9876543210", type: "text" },
                            { key: "Subject", value: "Printer Issue", type: "text" },
                            { key: "Description", value: "Printer not working", type: "text" },
                            { key: "file", type: "file", src: [] }
                        ]
                    },
                    url: {
                        raw: "{{base_url}}/employee/tickets/create",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "create"]
                    }
                }
            },
            {
                name: "6. Org Ticket Summary",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/org-summary",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "org-summary"]
                    }
                }
            },
            {
                name: "7. Org Ticket List",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/org-list?page=1&limit=10",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "org-list"],
                        query: [
                            { key: "page", value: "1" },
                            { key: "limit", value: "10" }
                        ]
                    }
                }
            },
            {
                name: "8. Report Summary",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/report-summary",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "report-summary"]
                    }
                }
            },
            {
                name: "9. Report Graph",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/report-graph",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "report-graph"]
                    }
                }
            },
            {
                name: "10. Download Report",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/report-download?format=csv",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "report-download"],
                        query: [{ key: "format", value: "csv" }]
                    }
                }
            },
            {
                name: "11. Get Replies (Chat)",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/1/replies",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "1", "replies"]
                    }
                }
            },
            {
                name: "12. Send Reply",
                request: {
                    method: "POST",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    body: {
                        mode: "formdata",
                        formdata: [
                            { key: "message", value: "This is a reply message", type: "text" },
                            { key: "status", value: "Open", type: "text" }, // Status Update
                            { key: "file", type: "file", src: [] }
                        ]
                    },
                    url: {
                        raw: "{{base_url}}/employee/tickets/1/reply",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "1", "reply"]
                    }
                }
            },
            {
                name: "13. Submit Feedback",
                request: {
                    method: "POST",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            rating: 5,
                            comment: "Great support!"
                        })
                    },
                    url: {
                        raw: "{{base_url}}/employee/tickets/1/feedback",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "1", "feedback"]
                    }
                }
            },
            {
                name: "14. Transfer Ticket",
                request: {
                    method: "POST",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }],
                    body: {
                        mode: "raw",
                        raw: JSON.stringify({
                            TicketId: "1",
                            AssigneeId: "55"
                        })
                    },
                    url: {
                        raw: "{{base_url}}/employee/tickets/assign",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "assign"]
                    }
                }
            },
            {
                name: "15. Get Assignee Dropdown",
                request: {
                    method: "GET",
                    header: [{ key: "Authorization", value: "Bearer {{token}}" }],
                    url: {
                        raw: "{{base_url}}/employee/tickets/dropdowns?type=Assignee",
                        host: ["{{base_url}}"],
                        path: ["employee", "tickets", "dropdowns"],
                        query: [{ key: "type", value: "Assignee" }]
                    }
                }
            }
        ]
    };

    const existingIndex = collection.item.findIndex(item => item.name === "Ticket Module");
    if (existingIndex !== -1) {
        collection.item[existingIndex] = ticketFolder;
        console.log("Updated existing Ticket Module folder.");
    } else {
        collection.item.push(ticketFolder);
        console.log("Added Ticket Module folder.");
    }

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 4), 'utf8');
    console.log("Employee Collection updated successfully.");

} catch (err) {
    console.error("Error updating collection:", err);
}
