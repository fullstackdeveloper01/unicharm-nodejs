# EMS Admin API - Node.js with Sequelize

This is the Node.js API version of the Employee Management System Admin, converted from .NET to Node.js using Express and Sequelize ORM.

## Project Structure

```
node-api/
├── config/
│   └── database.js          # Sequelize database configuration
├── controllers/             # Request handlers
│   ├── employeeController.js
│   ├── departmentController.js
│   ├── designationController.js
│   └── roleController.js
├── models/                  # Sequelize models
│   ├── index.js            # Model associations
│   ├── Employee.js
│   ├── Department.js
│   ├── Designation.js
│   ├── Role.js
│   └── ... (35+ models)
├── routes/                  # API routes
│   ├── index.js
│   ├── employeeRoutes.js
│   ├── departmentRoutes.js
│   ├── designationRoutes.js
│   └── roleRoutes.js
├── uploads/                 # File uploads directory
├── .env                     # Environment variables (create from .env.example)
├── .gitignore
├── package.json
├── server.js               # Main application entry point
└── README.md

```

## Installation

1. Navigate to the node-api directory:
```bash
cd node-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from the example below or create manually):
```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=EMS
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration
FROM_EMAIL=your_email@example.com
FROM_EMAIL_PASSWORD=your_password
EMAIL_SEND=Y

# Push Notification Configuration
PUSH_NOTIFICATION_SERVER_KEY=your_key
PUSH_NOTIFICATION_SENDER_ID=your_id
PUSH_NOTIFICATION_WEB_ADDRESS=https://fcm.googleapis.com/fcm/send

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for auto-reloading.

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Soft delete employee
- `PATCH /api/employees/:id/toggle-delete` - Toggle soft delete

**Dropdown Helpers:**
- `GET /api/employees/dropdowns/departments`
- `GET /api/employees/dropdowns/designations`
- `GET /api/employees/dropdowns/roles`
- `GET /api/employees/dropdowns/supervisors`
- `GET /api/employees/dropdowns/employees`
- `GET /api/employees/dropdowns/units`
- `GET /api/employees/dropdowns/zones`
- `GET /api/employees/dropdowns/locations`
- `GET /api/employees/dropdowns/user-categories`
- `GET /api/employees/dropdowns/user-types`
- `GET /api/employees/dropdowns/ttmt`

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Soft delete department
- `GET /api/departments/dropdowns/list` - Get departments for dropdown

### Designations
- `GET /api/designations` - Get all designations
- `GET /api/designations/:id` - Get designation by ID
- `POST /api/designations` - Create new designation
- `PUT /api/designations/:id` - Update designation
- `DELETE /api/designations/:id` - Soft delete designation
- `GET /api/designations/dropdowns/list` - Get designations for dropdown
- `GET /api/designations/dropdowns/expense-designations` - Get expense designations

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Soft delete role
- `GET /api/roles/dropdowns/list` - Get roles for dropdown

### Accountants (Uses Stored Procedure)
- `GET /api/accountants` - Get all accountants (USP_GetAccountant)
- `GET /api/accountants/:id` - Get accountant by ID

### Home/Dashboard (Uses Stored Procedures)
- `GET /api/home/dashboard` - Get complete dashboard data (all stored procedures)
- `GET /api/home/upcoming-birthdays` - Get upcoming birthdays (USP_GetUpComingBirthday)
- `GET /api/home/recent-news` - Get recent news (USP_GetRecentNews)
- `GET /api/home/recent-events` - Get recent events (USP_GetRecentEvent)
- `GET /api/home/recent-policies` - Get recent policies (USP_GetRecentPolicies)
- `GET /api/home/work-anniversaries` - Get work anniversaries (USP_GetWorkAnniversary)
- `GET /api/home/login-details` - Get login details (USP_GetLoginDetail)
- `GET /api/home/meetings/:employeeId` - Get meetings for user (USP_GetMeetingsForUser)

### Tickets (Uses Stored Procedure)
- `GET /api/tickets/assignee` - Get tickets for assignee (USP_GetTicketForAssignee)
- `GET /api/tickets/assignee?employeeId=123` - Get tickets for specific employee
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Soft delete ticket

## Database Models

The API includes Sequelize models for:
- Employees
- Departments
- Designations
- Roles
- Units, Zones, Locations
- Floors, Rooms
- Tickets, TicketReplies
- Messages, Notices, Policies
- Events, Holidays, News
- And many more...

All models use soft delete (IsDeleted flag) instead of hard deletes.

## Features

- ✅ RESTful API with Express.js
- ✅ Sequelize ORM for database operations
- ✅ **Stored Procedures Support** - All stored procedures from .NET code are implemented
- ✅ MySQL database support
- ✅ File upload support (Multer)
- ✅ Soft delete functionality
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Environment-based configuration
- ✅ Model associations and relationships

## Stored Procedures

The API uses stored procedures for optimized database queries. All stored procedures from the original .NET application are implemented:

- `USP_GetEmployeesList` - Employee listing
- `USP_GetAccountant` - Accountant listing
- `USP_GetUpComingBirthday` - Upcoming birthdays
- `USP_GetRecentNews` - Recent news
- `USP_GetRecentEvent` - Recent events
- `USP_GetRecentPolicies` - Recent policies
- `USP_GetWorkAnniversary` - Work anniversaries
- `USP_GetTicketForAssignee` - Tickets for assignee
- `USP_GetLoginDetail` - Login details
- `USP_GetMeetingsForUser` - Meetings for user

See `STORED_PROCEDURES.md` for detailed documentation.

## Dependencies

- **express** - Web framework
- **sequelize** - ORM for database operations
- **mysql2** - MySQL database driver
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemailer** - Email sending
- **express-validator** - Request validation

## Development

The API follows RESTful conventions and uses:
- Soft deletes (IsDeleted flag)
- Consistent response format: `{ success: boolean, data: any, error?: string }`
- File uploads stored in `uploads/` directory
- Environment-based configuration

## Notes

- The API connects to MySQL database
- All endpoints maintain compatibility with the original .NET API structure
- File uploads are handled via multipart/form-data
- The API uses the same database schema (converted from MSSQL to MySQL)
- Stored procedures use MySQL syntax (CALL instead of EXEC)
