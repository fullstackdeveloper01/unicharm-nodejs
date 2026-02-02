# 📦 Separate Postman Collections - SuperAdmin & Employee

## ✅ Two Separate Collections Created

As requested, the API has been split into **two separate Postman collections**:

### 1. SuperAdmin Collection
**File**: `Unicharm_SuperAdmin_API.postman_collection.json`

**Contains**:
- Login & Authentication
- Employees Management
- Departments
- Designations
- Roles
- Units, Zones, Locations
- Floors, Rooms
- Categories, Priorities, Groups
- Cities, Currency Master
- Expense Locations
- Accountants, Auditors
- Claims
- Corporate Price Policy
- Sales Price Policy
- Holidays
- Events
- News
- Notices
- Messages
- Quotes
- Products
- Policies
- Chorei Messages
- Emergency Response
- Photo Gallery
- Slider Images
- Popup Images
- Tickets
- Wall
- Meeting Requests
- Meeting Schedules
- Meeting Bookings
- Meeting Notifications
- Login Details

### 2. Employee Collection
**File**: `Unicharm_Employee_API.postman_collection.json`

**Contains**:
- Auth (Login, Logout, Verify Birth Year)
- Profile (Get, Update, Change Password)
- Home Dashboard
  - Chorei Messages
  - Emergency Response
  - Corporate News
  - Upcoming Events
  - Upcoming Birthdays
  - Products
  - New Employees
  - Work Anniversary
  - Gallery
- Holidays
- Wall (Posts, Likes, Comments)
- Wishes (Send, Get)
- Policies
- Tickets
- Meeting Room Management

---

## 🚀 How to Import

### For SuperAdmin:
1. Open Postman
2. Click **Import**
3. Select `Unicharm_SuperAdmin_API.postman_collection.json`
4. Click **Import**

### For Employee:
1. Open Postman
2. Click **Import**
3. Select `Unicharm_Employee_API.postman_collection.json`
4. Click **Import**

---

## ⚙️ Environment Setup

Create environment(s) with the following variables:

### SuperAdmin Environment
```json
{
  "base_url": "http://localhost:3000/api",
  "token": ""
}
```

### Employee Environment
```json
{
  "base_url": "http://localhost:3000/api",
  "token": ""
}
```

**Note**: You can use the same environment for both, or create separate environments for each.

---

## 📊 Collection Details

### SuperAdmin Collection
- **Name**: Unicharm SuperAdmin API
- **ID**: unicharm-superadmin-api
- **Version**: 2.0.0
- **Base URL**: `{{base_url}}/api`
- **Endpoints**: All SuperAdmin modules

### Employee Collection
- **Name**: Unicharm Employee API
- **ID**: unicharm-employee-api
- **Version**: 2.0.0
- **Base URL**: `{{base_url}}/employee`
- **Endpoints**: All Employee modules

---

## 🎯 Usage Examples

### SuperAdmin Login
```
Collection: Unicharm SuperAdmin API
Endpoint: Authentication → Login (Employee)

POST {{base_url}}/api/auth/login
Body:
{
  "email": "admin@unicharm.com",
  "password": "password",
  "type": "employee"
}
```

### Employee Login
```
Collection: Unicharm Employee API
Endpoint: Auth → Login

POST {{base_url}}/employee/auth/login
Body:
{
  "employeeId": "employee@unicharm.com",
  "password": "password"
}
```

---

## 📁 Folder Structure Alignment

### Backend Structure
```
routes/
├── superadmin/    → Unicharm_SuperAdmin_API.postman_collection.json
└── employee/      → Unicharm_Employee_API.postman_collection.json

controllers/
├── superadmin/    → SuperAdmin Collection
└── employee/      → Employee Collection

services/
├── superadmin/    → SuperAdmin Collection
└── employee/      → Employee Collection

middlewares/
└── shared/
    └── auth.js    → Used by both collections
```

---

## 🎯 Benefits of Separate Collections

### 1. Clear Separation
- ✅ SuperAdmin and Employee completely separated
- ✅ No confusion about which endpoints to use
- ✅ Each team can focus on their module

### 2. Easier Management
- ✅ Import only what you need
- ✅ Smaller file sizes
- ✅ Faster loading in Postman

### 3. Better Organization
- ✅ Each collection is self-contained
- ✅ Clear ownership of endpoints
- ✅ Easier to share with specific teams

### 4. Independent Testing
- ✅ Test SuperAdmin features separately
- ✅ Test Employee features separately
- ✅ Different environments for each if needed

---

## 📋 Available Collections

You now have **3 options**:

### Option 1: Separate Collections (RECOMMENDED)
- `Unicharm_SuperAdmin_API.postman_collection.json` - SuperAdmin only
- `Unicharm_Employee_API.postman_collection.json` - Employee only

### Option 2: Unified Collection
- `Unicharm_EMS_Complete_API.postman_collection.json` - Both in one file

### Option 3: Original Collections (Legacy)
- `EMS_Admin_API.postman_collection.json` - Old SuperAdmin
- `Employee_App_Postman_Collection.json` - Old Employee

**Recommendation**: Use **Option 1** (Separate Collections) for best organization!

---

## 🔄 Migration from Old Collections

### From Old SuperAdmin Collection
**Old**: `EMS_Admin_API.postman_collection.json`  
**New**: `Unicharm_SuperAdmin_API.postman_collection.json`

**Changes**:
- ✅ Same endpoints
- ✅ Better organization
- ✅ Aligned with new folder structure

### From Old Employee Collection
**Old**: `Employee_App_Postman_Collection.json`  
**New**: `Unicharm_Employee_API.postman_collection.json`

**Changes**:
- ✅ Same endpoints
- ✅ Better organization
- ✅ Aligned with new folder structure

---

## 📝 Notes

- ✅ Both collections use the same middleware (`middlewares/shared/auth.js`)
- ✅ Both collections use the same base_url variable
- ✅ Token authentication works the same way in both
- ✅ All endpoints from original collections are preserved
- ✅ Structure aligns with new backend folder organization

---

## 🎉 Quick Start

### For SuperAdmin Developers:
1. Import `Unicharm_SuperAdmin_API.postman_collection.json`
2. Set `base_url` to `http://localhost:3000/api`
3. Login via Authentication → Login
4. Start testing SuperAdmin endpoints!

### For Employee App Developers:
1. Import `Unicharm_Employee_API.postman_collection.json`
2. Set `base_url` to `http://localhost:3000/api`
3. Login via Auth → Login
4. Start testing Employee endpoints!

---

**Both collections are ready to use!** 🚀
