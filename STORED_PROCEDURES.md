# Stored Procedures Documentation

This document lists all stored procedures used in the Node.js API.

**Note:** The API uses MySQL database. Stored procedures use MySQL syntax (CALL instead of EXEC).

## Stored Procedures Implemented

### 1. USP_GetEmployeesList
- **Description**: Gets list of all employees
- **Parameters**: None
- **Usage**: `GET /api/employees`
- **Controller**: `employeeController.getAllEmployees()`

### 2. USP_GetAccountant
- **Description**: Gets list of all accountants
- **Parameters**: None
- **Usage**: `GET /api/accountants`
- **Controller**: `accountantController.getAllAccountants()`

### 3. USP_GetUpComingBirthday
- **Description**: Gets list of upcoming birthdays
- **Parameters**: None
- **Usage**: `GET /api/home/upcoming-birthdays` or `GET /api/home/dashboard`
- **Controller**: `homeController.getUpComingBirthday()`

### 4. USP_GetRecentNews
- **Description**: Gets list of recent news
- **Parameters**: None
- **Usage**: `GET /api/home/recent-news` or `GET /api/home/dashboard`
- **Controller**: `homeController.getRecentNews()`

### 5. USP_GetRecentEvent
- **Description**: Gets list of recent events
- **Parameters**: None
- **Usage**: `GET /api/home/recent-events` or `GET /api/home/dashboard`
- **Controller**: `homeController.getRecentEvent()`

### 6. USP_GetRecentPolicies
- **Description**: Gets list of recent policies
- **Parameters**: None
- **Usage**: `GET /api/home/recent-policies` or `GET /api/home/dashboard`
- **Controller**: `homeController.getRecentPolicies()`

### 7. USP_GetWorkAnniversary
- **Description**: Gets list of work anniversaries
- **Parameters**: None
- **Usage**: `GET /api/home/work-anniversaries` or `GET /api/home/dashboard`
- **Controller**: `homeController.getWorkAnniversary()`

### 8. USP_GetTicketForAssignee
- **Description**: Gets tickets assigned to an employee
- **Parameters**: 
  - `EmployeeId` (optional) - Employee ID
- **Usage**: `GET /api/tickets/assignee?employeeId=123`
- **Controller**: `ticketController.getTicketsForAssignee()`

### 9. USP_GetLoginDetail
- **Description**: Gets login details
- **Parameters**: (varies based on stored procedure definition)
- **Usage**: `GET /api/home/login-details?param1=value1&param2=value2`
- **Controller**: `homeController.getLoginDetail()`

### 10. USP_GetMeetingsForUser
- **Description**: Gets meetings for a specific user
- **Parameters**: 
  - `EmployeeId` - Employee ID (required)
- **Usage**: `GET /api/home/meetings/:employeeId`
- **Controller**: `homeController.getMeetingsForUser()`

## Service Location

All stored procedures are executed through the `storedProcedureService` located at:
- `node-api/services/storedProcedureService.js`

## Usage Example

```javascript
const storedProcedureService = require('../services/storedProcedureService');

// Execute stored procedure without parameters
const employees = await storedProcedureService.getEmployeesList();

// Execute stored procedure with parameters
const tickets = await storedProcedureService.getTicketForAssignee(123);
```

## Adding New Stored Procedures

To add a new stored procedure:

1. Add a method to `storedProcedureService.js`:
```javascript
exports.getNewProcedure = async (param1, param2) => {
  return await this.executeStoredProcedure('USP_NewProcedure', { 
    Param1: param1, 
    Param2: param2 
  });
};
```

2. Use it in your controller:
```javascript
const storedProcedureService = require('../services/storedProcedureService');

exports.getData = async (req, res) => {
  try {
    const data = await storedProcedureService.getNewProcedure(req.body.param1, req.body.param2);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

## Notes

- All stored procedures use Sequelize raw queries
- Parameters are passed as objects with key-value pairs
- **MySQL stored procedure syntax**: `CALL ProcedureName(:param1, :param2, ...)`
- MySQL stored procedures return results in arrays, the service extracts the first result set
- If a stored procedure fails, some controllers have fallback logic to use Sequelize queries
- Make sure your MySQL database has all the stored procedures created
