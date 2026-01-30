# .NET to Node.js Logic Mapping

This document outlines the architectural and logical mapping between the reference .NET Ticket Module and the implemented Node.js solution.

## 1. Architecture: MVC Pattern

| Component | .NET (Reference) | Node.js (Implementation) |
|-----------|------------------|--------------------------|
| **Controller** | C# Classes inheriting `ControllerBase` | Javascript Modules in `controllers/` |
| **Service (Business Logic)** | C# Services (Interfaces + Implementation) | Javascript Modules in `services/` |
| **Data Access** | Entity Framework Core (DbSet) | Sequelize ORM Models |
| **Routing** | Attribute Routing `[HttpGet("route")]` | Express Router `router.get('/route', ...)` |

## 2. Authentication

- **.NET**: Likely uses Identity Framework or Session-based auth with `[Authorize]` attribute.
- **Node.js**: Uses **JWT (JSON Web Token)**. Middleware `verifyToken` inspects the `Authorization` header and attaches the user to `req.user`.

## 3. Database & Models

- **.NET Entity Framework**:
  - Code-First or Database-First classes.
  - LINQ for queries.
- **Node.js Sequelize**:
  - Models defined in `models/*.js` using `sequelize.define`.
  - Associations defined in `models/index.js` (e.g., `Ticket.hasMany(TicketAssignee)`).
  - Queries using `Model.findAll`, `Model.findOne`, `Model.create`.

## 4. Specific Feature Mapping

### My Tickets Logic
- **.NET**: `_context.Tickets.Where(t => t.Requester == userId).ToList()`
- **Node.js**: 
  ```javascript
  Ticket.findAll({ where: { Requester: userId } })
  ```
- **Mapping**: The Node.js service `getTicketList` duplicates this logic, applying filters for Status and Search using Sequelize operators (`Op`).

### File Upload
- **.NET**: `IFormFile` in controller action.
- **Node.js**: `multer` middleware handles `multipart/form-data`. The file object is available in `req.file`.

### Organization Status Summary
- **.NET**: GroupBy LINQ query.
  ```csharp
  var summary = _context.Tickets.GroupBy(t => t.Status)
      .Select(g => new { Status = g.Key, Count = g.Count() });
  ```
- **Node.js**: Sequelize Aggregate.
  ```javascript
  Ticket.findAll({
      attributes: ['Status', [sequelize.fn('COUNT', sequelize.col('Id')), 'count']],
      group: ['Status']
  })
  ```

## 5. Folder Structure Mapping

- `Controllers/TicketController.cs` -> `controllers/employee/ticket.controller.js`
- `Services/TicketService.cs` -> `services/employee/ticket.service.js`
- `Models/Ticket.cs` -> `models/Ticket.js`
- `Data/ApplicationDbContext.cs` -> `models/index.js` (Associations)

## 6. Access Control
- **.NET**: Role-based access typically handled via `[Authorize(Roles="Admin")]`.
- **Node.js**: Role checks can be implemented in middleware or inside the Service layer. The current implementation relies on `verifyToken` for authentication and user definition.

## 7. Deliverables State
- **Database Schema**: Replicated via Sequelize Models.
- **Routes**: Defined in `routes/employee/ticket.routes.js`.
- **API**: Fully implemented with all requested endpoints.
