# Quick Start Guide

## Setup Instructions

1. **Navigate to the node-api folder:**
   ```bash
   cd node-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the `node-api` folder
   - Copy the database credentials and other settings from your original .NET Web.config
   - Update the values as needed

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test the API:**
   - Open your browser or use Postman
   - Visit: `http://localhost:3000/api/health`
   - You should see: `{ "success": true, "message": "EMS Admin API is running", "timestamp": "..." }`

## API Base URL
- Development: `http://localhost:3000/api`
- All endpoints are prefixed with `/api`

## Example API Calls

### Get All Employees
```bash
GET http://localhost:3000/api/employees
```

### Create Employee
```bash
POST http://localhost:3000/api/employees
Content-Type: application/json

{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john.doe@example.com",
  "DepartmentId": 1,
  "DesignationId": 1,
  "RoleId": 1
}
```

### Get Departments Dropdown
```bash
GET http://localhost:3000/api/departments/dropdowns/list
```

## Troubleshooting

### Database Connection Issues
- Verify your database credentials in `.env`
- Ensure MySQL server is running and accessible
- Check firewall settings if connecting to remote database
- Verify the port number (default: 3306 for MySQL)
- Make sure the database exists and user has proper permissions

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using port 3000

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` folder and reinstall: `rm -rf node_modules && npm install`

## Next Steps

1. Review the API endpoints in `README.md`
2. Test all CRUD operations
3. Configure authentication if needed
4. Set up production environment variables
5. Deploy to your server
