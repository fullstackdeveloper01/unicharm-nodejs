# MySQL Migration Guide

This document provides information about migrating from MSSQL to MySQL for this API.

## Changes Made

### 1. Database Driver
- **Changed from:** `mssql` package
- **Changed to:** `mysql2` package

### 2. Database Configuration
- **Default Port:** Changed from `51830` (MSSQL) to `3306` (MySQL)
- **Default User:** Changed from `sa` to `root`
- **Dialect:** Changed from `mssql` to `mysql`
- **Connection Options:** Removed MSSQL-specific options (encrypt, trustServerCertificate, etc.)

### 3. Stored Procedure Syntax
- **MSSQL:** `EXEC ProcedureName @Param1 = :value1, @Param2 = :value2`
- **MySQL:** `CALL ProcedureName(:param1, :param2, ...)`

### 4. Stored Procedure Results
- MySQL stored procedures return results in arrays
- The service automatically extracts the first result set

## Environment Variables

Update your `.env` file:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=EMS
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql
```

## Installation

After updating the configuration, reinstall dependencies:

```bash
cd node-api
npm install
```

This will install `mysql2` instead of `mssql`.

## Stored Procedures

### Important Notes:

1. **Parameter Order:** MySQL stored procedures use positional parameters. Make sure your stored procedures match the parameter order expected by the API.

2. **Parameter Names:** The stored procedure service maps object keys to parameters. Ensure your MySQL stored procedures accept parameters in the correct order.

3. **Creating Stored Procedures:** If you're migrating stored procedures from MSSQL to MySQL, you'll need to:
   - Convert MSSQL syntax to MySQL syntax
   - Update parameter declarations
   - Adjust any MSSQL-specific SQL functions

### Example MySQL Stored Procedure:

```sql
DELIMITER //
CREATE PROCEDURE USP_GetEmployeesList()
BEGIN
    SELECT 
        e.Id,
        CONCAT(e.FirstName, ' ', e.LastName) AS Name,
        e.Email,
        d.DepartmentName AS Department,
        des.DesignationName AS Designation,
        COALESCE(e.UserPhoto, '/Images/Profile/user-avatar.jpg') AS UserPhoto,
        e.IsDeleted
    FROM Employees e
    LEFT JOIN Departments d ON e.DepartmentId = d.Id
    LEFT JOIN Designations des ON e.DesignationId = des.Id
    WHERE e.IsDeleted = 0
    ORDER BY e.CreatedOn DESC;
END //
DELIMITER ;
```

### Example with Parameters:

```sql
DELIMITER //
CREATE PROCEDURE USP_GetTicketForAssignee(IN p_EmployeeId INT)
BEGIN
    SELECT * 
    FROM Tickets 
    WHERE EmployeeId = p_EmployeeId 
    AND IsDeleted = 0;
END //
DELIMITER ;
```

## Testing

After migration:

1. **Test Database Connection:**
   ```bash
   npm start
   ```
   Check console for "Database connection established successfully."

2. **Test Stored Procedures:**
   ```bash
   # Test employees endpoint
   curl http://localhost:3000/api/employees
   
   # Test dashboard
   curl http://localhost:3000/api/home/dashboard
   ```

## Troubleshooting

### Connection Issues
- Verify MySQL server is running: `mysql -u root -p`
- Check user permissions: `GRANT ALL PRIVILEGES ON EMS.* TO 'root'@'localhost';`
- Verify database exists: `SHOW DATABASES;`

### Stored Procedure Issues
- Verify stored procedures exist: `SHOW PROCEDURE STATUS WHERE Db = 'EMS';`
- Check stored procedure syntax: `SHOW CREATE PROCEDURE USP_GetEmployeesList;`
- Test stored procedure directly in MySQL:
  ```sql
  CALL USP_GetEmployeesList();
  ```

### Parameter Mismatch
- MySQL stored procedures use positional parameters
- Ensure parameter order matches in your stored procedure definition
- Check the stored procedure service logs for exact parameter names being used

## Data Type Differences

When migrating from MSSQL to MySQL, be aware of:
- **BIT** in MSSQL → **TINYINT(1)** or **BOOLEAN** in MySQL
- **NVARCHAR** → **VARCHAR** with UTF8MB4 charset
- **DATETIME2** → **DATETIME** or **TIMESTAMP**
- **IDENTITY** → **AUTO_INCREMENT**

## Next Steps

1. Create all stored procedures in MySQL database
2. Test each endpoint that uses stored procedures
3. Verify data integrity
4. Update any MSSQL-specific SQL queries in your stored procedures
