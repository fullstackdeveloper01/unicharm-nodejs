# Folder Restructure Summary

## Overview
Created a new `superadmin` folder structure to organize all non-employee files, and consolidated middleware into a single shared location for both superadmin and employee.

## Changes Made

### 1. New Folders Created
- `routes/superadmin/`
- `controllers/superadmin/`
- `services/superadmin/`
- `middlewares/shared/` (consolidated middleware location)

### 2. Files Moved to `routes/superadmin/` (43 files)
- accountantRoutes.js
- auditorRoutes.js
- authRoutes.js
- categoryRoutes.js
- choreiMessageRoutes.js
- cityRoutes.js
- claimRoutes.js
- corporatePricePolicyRoutes.js
- currencyMasterRoutes.js
- departmentRoutes.js
- designationRoutes.js
- emergencyResponseRoutes.js
- employeeRoutes.js
- eventRoutes.js
- expenseLocationRoutes.js
- floorRoutes.js
- groupRoutes.js
- holidayRoutes.js
- homeRoutes.js
- locationRoutes.js
- loginDetailRoutes.js
- meetingBooking.routes.js
- meetingNotificationRoutes.js
- meetingRequest.routes.js
- meetingRequestRoutes.js
- meetingSchedule.routes.js
- messageRoutes.js
- newsRoutes.js
- noticeRoutes.js
- photoGalleryRoutes.js
- policyRoutes.js
- popupImageRoutes.js
- priorityRoutes.js
- productRoutes.js
- quoteRoutes.js
- roleRoutes.js
- roomRoutes.js
- salesPricePolicyRoutes.js
- sliderImageRoutes.js
- ticketRoutes.js
- unitRoutes.js
- wallRoutes.js
- zoneRoutes.js

### 3. Files Moved to `controllers/superadmin/` (42 files)
- accountantController.js
- auditorController.js
- authController.js
- categoryController.js
- choreiMessageController.js
- cityController.js
- claimController.js
- corporatePricePolicyController.js
- currencyMasterController.js
- departmentController.js
- designationController.js
- emergencyResponseController.js
- employeeController.js
- eventController.js
- expenseLocationController.js
- floorController.js
- groupController.js
- holidayController.js
- homeController.js
- locationController.js
- loginDetailController.js
- meetingBooking.controller.js
- meetingNotificationController.js
- meetingRequest.controller.js
- meetingRequestController.js
- meetingSchedule.controller.js
- messageController.js
- newsController.js
- noticeController.js
- photoGalleryController.js
- policyController.js
- popupImageController.js
- priorityController.js
- productController.js
- quoteController.js
- roleController.js
- roomController.js
- salesPricePolicyController.js
- sliderImageController.js
- ticketController.js
- unitController.js
- zoneController.js

### 4. Files Moved to `services/superadmin/` (37 files)
- accountantService.js
- auditorService.js
- categoryService.js
- choreiMessageService.js
- cityService.js
- claimService.js
- corporatePricePolicyService.js
- currencyMasterService.js
- departmentService.js
- designationService.js
- emergencyResponseService.js
- employeeService.js
- eventService.js
- expenseLocationService.js
- floorService.js
- groupService.js
- holidayService.js
- homeService.js
- locationService.js
- loginDetailService.js
- meetingNotificationService.js
- meetingRequestService.js
- messageService.js
- newsService.js
- noticeService.js
- photoGalleryService.js
- policyService.js
- popupImageService.js
- priorityService.js
- productService.js
- quoteService.js
- roomService.js
- salesPricePolicyService.js
- sliderImageService.js
- unitService.js
- wallService.js
- zoneService.js

### 5. Middleware Consolidation
**Old Structure:**
- `middleware/authMiddleware.js` (employee)
- `middlewares/superadmin/auth.middleware.js` (superadmin)

**New Structure:**
- `middlewares/shared/auth.js` (single unified file for both employee & superadmin)

All authentication middleware has been consolidated into a single `auth.js` file that serves both employee and superadmin modules.

### 6. Removed Files & Directories
- `middleware/authMiddleware.js` (old employee middleware file)
- `middlewares/superadmin/auth.middleware.js` (old superadmin middleware file)
- `middleware/` (old employee middleware folder)
- `middlewares/superadmin/` (old superadmin middleware folder)

## Current Structure

```
unicharm-nodejs/
├── routes/
│   ├── employee/          (9 files - employee-specific routes)
│   ├── superadmin/        (43 files - superadmin routes)
│   └── index.js
│
├── controllers/
│   ├── employee/          (8 files - employee-specific controllers)
│   └── superadmin/        (42 files - superadmin controllers)
│
├── services/
│   ├── employee/          (8 files - employee-specific services)
│   ├── superadmin/        (37 files - superadmin services)
│   ├── UPDATE_STATUS.js
│   └── storedProcedureService.js
│
└── middlewares/
    └── shared/
        └── auth.js        (1 file - unified for both employee & superadmin)
```

## Files Remaining in Root Directories
- **routes/**: index.js (main router file)
- **controllers/**: None (all moved)
- **services/**: UPDATE_STATUS.js, storedProcedureService.js (utility files)
- **middlewares/**: None (all moved to shared/)

## Notes
- No code changes were made to any files
- Only folder structure was reorganized
- Employee folder structure remains unchanged
- All superadmin-specific files are now organized in dedicated folders
- Middleware has been consolidated into a single `auth.js` file shared by both employee and superadmin modules
