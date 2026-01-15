# Postman Collection Setup Guide

This guide explains how to import and use the EMS Admin API Postman collection.

## Importing the Collection

### Method 1: Import from File
1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `EMS_Admin_API.postman_collection.json` from the `node-api` folder
5. Click **Import**

### Method 2: Import from URL (if hosted)
1. Open Postman
2. Click **Import** button
3. Select **Link** tab
4. Paste the collection URL
5. Click **Continue** and then **Import**

## Environment Variables

The collection uses a variable `base_url` which is set to `http://localhost:3000` by default.

### To Change the Base URL:

1. Click on the collection name
2. Go to **Variables** tab
3. Update the `base_url` value (e.g., `http://your-server.com:3000`)
4. Click **Save**

### Creating an Environment (Recommended)

1. Click the **Environments** icon (left sidebar)
2. Click **+** to create a new environment
3. Name it "EMS Admin API - Local" or "EMS Admin API - Production"
4. Add variable:
   - **Variable:** `base_url`
   - **Initial Value:** `http://localhost:3000`
   - **Current Value:** `http://localhost:3000`
5. Click **Save**
6. Select the environment from the dropdown (top right)

## Collection Structure

The collection is organized into the following folders:

### 1. Health Check
- Health Check - Verify API is running

### 2. Employees
- Get All Employees (uses stored procedure)
- Get Employee by ID
- Create Employee
- Update Employee
- Delete Employee
- Toggle Soft Delete
- Dropdown endpoints (departments, designations, roles, supervisors, units, zones, locations)

### 3. Departments
- Get All Departments
- Get Department by ID
- Create Department
- Update Department
- Delete Department
- Get Departments Dropdown

### 4. Designations
- Get All Designations
- Get Designation by ID
- Create Designation
- Update Designation
- Delete Designation
- Get Designations Dropdown
- Get Expense Designations Dropdown

### 5. Roles
- Get All Roles
- Get Role by ID
- Create Role
- Update Role
- Delete Role
- Get Roles Dropdown

### 6. Accountants
- Get All Accountants (uses stored procedure)
- Get Accountant by ID

### 7. Home/Dashboard
- Get Dashboard (all stored procedures)
- Get Upcoming Birthdays
- Get Recent News
- Get Recent Events
- Get Recent Policies
- Get Work Anniversaries
- Get Login Details
- Get Meetings for User

### 8. Tickets
- Get Tickets for Assignee (uses stored procedure)
- Get All Tickets
- Get Ticket by ID
- Create Ticket
- Update Ticket
- Delete Ticket

## Using the Collection

### Testing Endpoints

1. **Start your API server:**
   ```bash
   cd node-api
   npm start
   ```

2. **Test Health Check:**
   - Open "Health Check" folder
   - Click "Health Check" request
   - Click **Send**
   - You should see: `{ "success": true, "message": "EMS Admin API is running", ... }`

3. **Test Other Endpoints:**
   - Navigate to any folder
   - Select a request
   - Update path variables if needed (e.g., `:id` values)
   - Click **Send**

### Updating Request Bodies

For POST and PUT requests, you can modify the request body:

1. Select the request
2. Go to **Body** tab
3. Update the JSON as needed
4. Click **Send**

### Path Variables

Some requests use path variables (e.g., `:id`, `:employeeId`):

1. Click on the request
2. Go to **Params** tab
3. Update the variable values
4. The URL will automatically update

## Example Workflows

### Creating an Employee

1. **Get Departments Dropdown:**
   - Employees → Get Departments Dropdown
   - Note the `value` (ID) of the department you want

2. **Get Designations Dropdown:**
   - Employees → Get Designations Dropdown
   - Note the `value` (ID) of the designation you want

3. **Get Roles Dropdown:**
   - Employees → Get Roles Dropdown
   - Note the `value` (ID) of the role you want

4. **Create Employee:**
   - Employees → Create Employee
   - Update the request body with the IDs from steps 1-3
   - Click **Send**

### Testing Stored Procedures

1. **Test Employee List (Stored Procedure):**
   - Employees → Get All Employees
   - This uses `USP_GetEmployeesList` stored procedure

2. **Test Dashboard:**
   - Home/Dashboard → Get Dashboard
   - This executes multiple stored procedures in parallel

## Troubleshooting

### Connection Refused
- Ensure your API server is running
- Check the `base_url` variable matches your server address
- Verify the port number (default: 3000)

### 404 Not Found
- Check the endpoint path is correct
- Verify the API routes are properly configured
- Check server logs for routing errors

### 500 Internal Server Error
- Check server console for error messages
- Verify database connection
- Ensure stored procedures exist in MySQL database
- Check database credentials in `.env` file

### Empty Results
- Verify database has data
- Check if stored procedures return data when called directly in MySQL
- Review server logs for any warnings

## Tips

1. **Save Responses:** Right-click on a response → Save Response → Save as Example
2. **Create Tests:** Add tests in the **Tests** tab to validate responses
3. **Use Pre-request Scripts:** Add scripts in **Pre-request Script** tab for dynamic values
4. **Collection Runner:** Use Collection Runner to test all endpoints at once
5. **Export Collection:** Share the collection with your team by exporting it

## Next Steps

1. Import the collection
2. Set up environment variables
3. Test the health check endpoint
4. Explore different endpoints
5. Customize request bodies for your data
6. Add tests and scripts as needed
