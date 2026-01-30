# Authentication Guide for Corporate Price Policy APIs

## 🔐 Authentication Required

The Corporate Price Policy APIs (and most other APIs) are **protected routes** that require authentication.

## 📝 How to Authenticate in Postman

### **Step 1: Login to Get Token**

1. In Postman, find the **"Login"** or **"Authentication"** folder
2. Use the **"Login (Employee)"** request
3. **URL**: `{{base_url}}/api/auth/login`
4. **Method**: POST
5. **Body** (raw JSON):
```json
{
  "email": "takaku-k@unicharm.com",
  "password": "ken3010088",
  "type": "employee"
}
```

6. Click **Send**
7. You will receive a response like:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

8. **Copy the token value** from the response

---

### **Step 2: Set Token in Collection Variable**

**Option A: Set Collection Variable (Recommended)**
1. In Postman, click on the **"EMS Admin API"** collection
2. Click the **three dots (...)** → **Edit**
3. Go to **Variables** tab
4. Find the `token` variable
5. Paste your token in the **Current Value** field
6. Click **Save**

**Option B: Add to Each Request Manually**
1. Go to any Corporate Price Policy request
2. Click on **Headers** tab
3. Add header:
   - **Key**: `Authorization`
   - **Value**: `Bearer {{token}}`

---

### **Step 3: Test Corporate Price Policy API**

Now you can test the Corporate Price Policy endpoints:

1. **GET** `{{base_url}}/api/corporate-price-policies?page=1&limit=10`
2. The request should now work with the token!

---

## 🎯 **Quick Test Sequence**

1. **Login** → Get token
2. **Set token** in collection variable
3. **Test GET All** Corporate Price Policies
4. **Test CREATE** a new policy
5. **Test GET by ID**
6. **Test UPDATE**
7. **Test DELETE**

---

## ⚠️ **Troubleshooting**

### Error: "Access denied. No token provided."
- **Solution**: You need to login first and set the token

### Error: "Invalid token" or "Token expired"
- **Solution**: Login again to get a fresh token

### Error: "ECONNREFUSED"
- **Solution**: Make sure the server is running on port 3005

---

## 📌 **Important Notes**

- Tokens expire after a certain time (check your JWT configuration)
- You need to login again when the token expires
- The token variable is shared across all requests in the collection
- Protected routes include: Corporate Price Policies, Sales Price Policies, Employees, etc.
- Public routes (no token needed): Login, Health Check

---

## ✅ **Summary**

1. ✅ Login to get token
2. ✅ Set token in collection variable
3. ✅ All protected APIs will now work!
