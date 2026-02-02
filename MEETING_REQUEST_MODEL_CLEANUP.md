# MeetingRequest Model Cleanup

## 🔴 User Request

"remove MeetingRequest.model file and remove all of its dependencies."

---

## 📋 Action Taken

1.  **Verified Usage**: Searched codebase for `MeetingRequest.model`. No references found.
2.  **Confirmed Wrapper**: The file `models/MeetingRequest.model.js` was just re-exporting `models/MeetingRequest.js`.
3.  **Deleted File**: Removed `models/MeetingRequest.model.js`.

## 🔍 Validation

- `models/index.js` imports `MeetingRequest` which resolves to the active `MeetingRequest.js`.
- No other dependencies were found.

**Cleanup complete.**
