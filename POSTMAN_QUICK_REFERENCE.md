# 🎯 Quick Reference - Unified Postman Collection

## ✅ What Was Done

Created a **single unified Postman collection** that combines both SuperAdmin and Employee APIs, organized according to the new folder structure.

## 📦 Files

### New File (USE THIS):
**`Unicharm_EMS_Complete_API.postman_collection.json`**
- Size: ~197KB
- Lines: 6,543
- Contains: Both SuperAdmin and Employee endpoints

### Old Files (For Reference Only):
- `EMS_Admin_API.postman_collection.json` (SuperAdmin only)
- `Employee_App_Postman_Collection.json` (Employee only)

## 📁 Collection Structure

```
Unicharm EMS - Complete API Collection
│
├── 📂 SuperAdmin (All admin endpoints)
│   ├── Login
│   ├── Authentication  
│   ├── Employees
│   ├── Departments
│   ├── Designations
│   ├── ... (all superadmin modules)
│   
└── 📂 Employee (All employee endpoints)
    ├── Auth
    ├── Profile
    ├── Home
    ├── Holidays
    ├── Wall
    ├── Wishes
    ├── Policies
    └── Tickets
```

## 🚀 How to Import

1. Open Postman
2. Click **Import** button
3. Select `Unicharm_EMS_Complete_API.postman_collection.json`
4. Click **Import**
5. Done! ✅

## ⚙️ Environment Setup

Create/Update environment with:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:3000/api` |
| `token` | (auto-saved after login) |

## 📊 Alignment with Backend Structure

### Backend Folders → Postman Folders

```
Backend                    Postman Collection
─────────────────────     ──────────────────────
routes/
├── superadmin/    →      SuperAdmin/
└── employee/      →      Employee/

controllers/
├── superadmin/    →      SuperAdmin/
└── employee/      →      Employee/

services/
├── superadmin/    →      SuperAdmin/
└── employee/      →      Employee/

middlewares/
└── shared/
    └── auth.js    →      Used by both modules
```

## 🎯 Key Features

✅ **Single Collection**: One file for all APIs
✅ **Clear Organization**: SuperAdmin and Employee separated
✅ **Folder Structure**: Matches backend structure
✅ **Shared Variables**: Common base_url and token
✅ **Easy Navigation**: Logical grouping of endpoints

## 📝 Usage Examples

### SuperAdmin Login:
```
POST {{base_url}}/api/auth/login
Body: {
  "email": "admin@unicharm.com",
  "password": "password",
  "type": "accountant"
}
```

### Employee Login:
```
POST {{base_url}}/employee/auth/login
Body: {
  "employeeId": "employee@unicharm.com",
  "password": "password"
}
```

## 🔄 Migration Path

**Old Way** (2 collections):
1. Import EMS_Admin_API.postman_collection.json
2. Import Employee_App_Postman_Collection.json
3. Switch between collections

**New Way** (1 collection):
1. Import Unicharm_EMS_Complete_API.postman_collection.json
2. Navigate to SuperAdmin or Employee folder
3. Everything in one place! 🎉

## 📌 Important Notes

- ✅ All endpoints preserved from both collections
- ✅ No functionality lost in merge
- ✅ Structure reflects new backend organization
- ✅ Both modules use shared middleware (`middlewares/shared/auth.js`)
- ✅ Environment variables work for both modules

## 🎉 Benefits

1. **Simplified Testing**: One collection to rule them all
2. **Better Organization**: Clear separation of concerns
3. **Easier Onboarding**: New developers see complete API structure
4. **Consistent Variables**: No duplicate environment setup
5. **Future-Proof**: Easy to add new modules

---

**Recommendation**: Use `Unicharm_EMS_Complete_API.postman_collection.json` for all API testing going forward!
