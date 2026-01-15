const storedProcedureService = require('../services/storedProcedureService');

// Get dashboard data using stored procedures
exports.getDashboard = async (req, res) => {
  try {
    // Execute all stored procedures in parallel
    const [
      upComingBirthday,
      recentNews,
      recentEvent,
      recentPolicies,
      workAnniversary
    ] = await Promise.all([
      storedProcedureService.getUpComingBirthday(),
      storedProcedureService.getRecentNews(),
      storedProcedureService.getRecentEvent(),
      storedProcedureService.getRecentPolicies(),
      storedProcedureService.getWorkAnniversary()
    ]);

    const dashboardData = {
      UpComingBirthday: upComingBirthday || [],
      RecentNews: recentNews || [],
      RecentEvent: recentEvent || [],
      RecentPolicies: recentPolicies || [],
      WorkAnniversary: workAnniversary || []
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get upcoming birthdays
exports.getUpComingBirthday = async (req, res) => {
  try {
    const birthdays = await storedProcedureService.getUpComingBirthday();
    res.json({ success: true, data: birthdays });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get recent news
exports.getRecentNews = async (req, res) => {
  try {
    const news = await storedProcedureService.getRecentNews();
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get recent events
exports.getRecentEvent = async (req, res) => {
  try {
    const events = await storedProcedureService.getRecentEvent();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get recent policies
exports.getRecentPolicies = async (req, res) => {
  try {
    const policies = await storedProcedureService.getRecentPolicies();
    res.json({ success: true, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get work anniversaries
exports.getWorkAnniversary = async (req, res) => {
  try {
    const anniversaries = await storedProcedureService.getWorkAnniversary();
    res.json({ success: true, data: anniversaries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get login details
exports.getLoginDetail = async (req, res) => {
  try {
    const params = req.query; // Get parameters from query string
    const loginDetails = await storedProcedureService.getLoginDetail(params);
    res.json({ success: true, data: loginDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get meetings for user
exports.getMeetingsForUser = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }
    
    const meetings = await storedProcedureService.getMeetingsForUser(parseInt(employeeId));
    res.json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
