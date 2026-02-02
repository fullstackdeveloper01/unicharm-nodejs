# Postman Collection - Updated for New Folder Structure

## 📋 Overview

A **single unified Postman collection** has been created that reflects the new folder structure with separate SuperAdmin and Employee modules.

## 📁 New Collection File

**File**: `Unicharm_EMS_Complete_API.postman_collection.json`

This collection combines both:
- **SuperAdmin APIs** (from `EMS_Admin_API.postman_collection.json`)
- **Employee APIs** (from `Employee_App_Postman_Collection.json`)

## 🏗️ Collection Structure

```
Unicharm EMS - Complete API Collection
├── SuperAdmin
│   ├── Login
│   ├── Authentication
│   ├── Health Check
│   ├── Employees
│   ├── Departments
│   ├── Designations
│   ├── Roles
│   ├── Units
│   ├── Zones
│   ├── Locations
│   ├── Floors
│   ├── Rooms
│   ├── Categories
│   ├── Priorities
│   ├── Groups
│   ├── Cities
│   ├── Currency Master
│   ├── Expense Locations
│   ├── Accountants
│   ├── Auditors
│   ├── Claims
│   ├── Corporate Price Policy
│   ├── Sales Price Policy
│   ├── Holidays
│   ├── Events
│   ├── News
│   ├── Notices
│   ├── Messages
│   ├── Quotes
│   ├── Products
│   ├── Policies
│   ├── Chorei Messages
│   ├── Emergency Response
│   ├── Photo Gallery
│   ├── Slider Images
│   ├── Popup Images
│   ├── Tickets
│   ├── Wall
│   ├── Meeting Requests
│   ├── Meeting Schedules
│   ├── Meeting Bookings
│   ├── Meeting Notifications
│   └── Login Details
│
└── Employee
    ├── Auth
    ├── Profile
    ├── Home
    ├── Holidays
    ├── Wall
    ├── Wishes
    ├── Policies
    ├── Tickets
    └── Meeting Room Management
```

## 🔧 How to Use

### 1. Import the Collection

1. Open Postman
2. Click **Import**
3. Select `Unicharm_EMS_Complete_API.postman_collection.json`
4. Click **Import**

### 2. Set Up Environment Variables

Create a new environment or update existing one with:

```json
{
  "base_url": "http://localhost:3000/api",
  "token": ""
}
```

### 3. Test the APIs

- **SuperAdmin APIs**: Navigate to `SuperAdmin` folder
- **Employee APIs**: Navigate to `Employee` folder

## 📊 Comparison

### Before (2 separate collections):

1. **EMS_Admin_API.postman_collection.json** (200KB, 5017 lines)
   - SuperAdmin endpoints only

2. **Employee_App_Postman_Collection.json** (62KB, 1533 lines)
   - Employee endpoints only

### After (1 unified collection):

**Unicharm_EMS_Complete_API.postman_collection.json**
- Both SuperAdmin and Employee endpoints
- Organized by module
- Single source of truth

## 🎯 Benefits

1. ✅ **Single Collection**: One file for all APIs
2. ✅ **Clear Organization**: SuperAdmin and Employee modules separated
3. ✅ **Easy Navigation**: Folder structure matches backend structure
4. ✅ **Consistent Variables**: Shared environment variables
5. ✅ **Better Maintenance**: Update in one place

## 📝 Old Collections

The original collections are still available for reference:
- `EMS_Admin_API.postman_collection.json` (SuperAdmin only)
- `Employee_App_Postman_Collection.json` (Employee only)

**Recommendation**: Use the new unified collection `Unicharm_EMS_Complete_API.postman_collection.json` for all testing.

## 🔄 Folder Structure Alignment

The collection now aligns with the backend folder structure:

### Backend Structure:
```
routes/
├── employee/          → Employee folder in Postman
└── superadmin/        → SuperAdmin folder in Postman

controllers/
├── employee/
└── superadmin/

services/
├── employee/
└── superadmin/

middlewares/
└── shared/
    └── auth.js        → Used by both modules
```

### Postman Structure:
```
Unicharm EMS - Complete API Collection
├── SuperAdmin         → Maps to routes/superadmin/
└── Employee           → Maps to routes/employee/
```

## 🚀 Quick Start

1. Import `Unicharm_EMS_Complete_API.postman_collection.json`
2. Set `base_url` to `http://localhost:3000/api`
3. Login via SuperAdmin → Login or Employee → Auth → Login
4. Token will be auto-saved to environment
5. Test other endpoints

## 📌 Notes

- All endpoints use the same `base_url` variable
- Authentication tokens are automatically saved after login
- Both modules share the same middleware (`middlewares/shared/auth.js`)
- Collection reflects the new folder structure implemented in the backend
