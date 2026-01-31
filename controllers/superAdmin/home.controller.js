
const storedProcedureService = require('../../services/superAdmin/storedProcedure.service.js'); // Kept only for non-dashboard items if any remaining
const db = require('../../models/superAdmin');

// --- Business Logic (Merged) ---


/**
 * Get upcoming birthdays
 * @returns {Promise<Array>} List of upcoming birthdays
 */
const getUpcomingBirthdays = async () => {
    return await db.Employee.getUpcomingBirthdays();
};

/**
 * Get work anniversaries
 * @returns {Promise<Array>} List of work anniversaries
 */
const getWorkAnniversaries = async () => {
    return await db.Dashboard.getWorkAnniversary();
};

/**
 * Get company policies
 * @returns {Promise<Array>} List of company policies
 */
const getCompanyPolicies = async () => {
    return await db.Dashboard.getRecentPolicies();
};

/**
 * Get recent news
 * @returns {Promise<Array>} List of recent news
 */
const getRecentNews = async () => {
    return await db.Dashboard.getRecentNews();
};

/**
 * Get upcoming events
 * @returns {Promise<Array>} List of upcoming events
 */
const getUpcomingEvents = async () => {
    return await db.Dashboard.getRecentEvent();
};

// -----------------------------

// Helper for standard response
const sendResponse = (res, success, message, data = null, errors = null) => {
  res.json({
    success,
    message,
    data,
    errors
  });
};

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const [
      upComingBirthday,
      recentNews,
      recentEvent,
      recentPolicies,
      workAnniversary
    ] = await Promise.all([
      getUpcomingBirthdays(),
      getRecentNews(),
      getUpcomingEvents(),
      getCompanyPolicies(),
      getWorkAnniversaries()
    ]);

    const dashboardData = {
      UpComingBirthday: upComingBirthday || [],
      RecentNews: recentNews || [],
      RecentEvent: recentEvent || [],
      RecentPolicies: recentPolicies || [],
      WorkAnniversary: workAnniversary || []
    };

    sendResponse(res, true, 'Dashboard data retrieved successfully', dashboardData);
  } catch (error) {
    console.error('Error in getDashboard:', error);
    sendResponse(res, false, 'Failed to retrieve dashboard data', null, { message: error.message });
  }
};

// Get upcoming birthdays
exports.getUpComingBirthday = async (req, res) => {
  try {
    const birthdays = await getUpcomingBirthdays();
    sendResponse(res, true, 'Upcoming birthdays retrieved successfully', birthdays);
  } catch (error) {
    console.error('Error in getUpComingBirthday:', error);
    sendResponse(res, false, 'Failed to retrieve upcoming birthdays', null, { message: error.message });
  }
};

// Get recent news
exports.getRecentNews = async (req, res) => {
  try {
    const news = await getRecentNews();
    sendResponse(res, true, 'Recent news retrieved successfully', news);
  } catch (error) {
    console.error('Error in getRecentNews:', error);
    sendResponse(res, false, 'Failed to retrieve recent news', null, { message: error.message });
  }
};

// Get recent events (Upcoming Events)
exports.getRecentEvent = async (req, res) => {
  try {
    const events = await getUpcomingEvents();
    sendResponse(res, true, 'Upcoming events retrieved successfully', events);
  } catch (error) {
    console.error('Error in getRecentEvent:', error);
    sendResponse(res, false, 'Failed to retrieve upcoming events', null, { message: error.message });
  }
};

// Get recent policies (Company Policies)
exports.getRecentPolicies = async (req, res) => {
  try {
    const policies = await getCompanyPolicies();
    sendResponse(res, true, 'Company policies retrieved successfully', policies);
  } catch (error) {
    console.error('Error in getRecentPolicies:', error);
    sendResponse(res, false, 'Failed to retrieve company policies', null, { message: error.message });
  }
};

// Get work anniversaries
exports.getWorkAnniversary = async (req, res) => {
  try {
    const anniversaries = await getWorkAnniversaries();
    sendResponse(res, true, 'Work anniversaries retrieved successfully', anniversaries);
  } catch (error) {
    console.error('Error in getWorkAnniversary:', error);
    sendResponse(res, false, 'Failed to retrieve work anniversaries', null, { message: error.message });
  }
};

// Get login details
exports.getLoginDetail = async (req, res) => {
  try {
    const params = req.query;
    // This calls storedProcedureService directly as it wasn't requested in the dashboard API list specifically to be refactored, 
    // but better to move it if I can. However, strict instructions say "Do NOT refactor... unless required". 
    // I'll keep it as is for now, but standardize response.
    const loginDetails = await storedProcedureService.getLoginDetail(params);
    sendResponse(res, true, 'Login details retrieved successfully', loginDetails);
  } catch (error) {
    console.error('Error in getLoginDetail:', error);
    sendResponse(res, false, 'Failed to retrieve login details', null, { message: error.message });
  }
};

// Get meetings for user
exports.getMeetingsForUser = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return sendResponse(res, false, 'Employee ID is required', null, { message: 'Employee ID is missing' });
    }

    const meetings = await storedProcedureService.getMeetingsForUser(parseInt(employeeId));
    sendResponse(res, true, 'Meetings retrieved successfully', meetings);
  } catch (error) {
    console.error('Error in getMeetingsForUser:', error);
    sendResponse(res, false, 'Failed to retrieve meetings', null, { message: error.message });
  }
};
