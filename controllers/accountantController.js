const storedProcedureService = require('../services/storedProcedureService');

// Get all accountants using stored procedure
exports.getAllAccountants = async (req, res) => {
  try {
    const accountants = await storedProcedureService.getAccountant();
    res.json({ success: true, data: accountants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get accountant by ID
exports.getAccountantById = async (req, res) => {
  try {
    const { id } = req.params;
    const accountants = await storedProcedureService.getAccountant();
    const accountant = accountants.find(acc => acc.Id === parseInt(id));
    
    if (!accountant) {
      return res.status(404).json({ success: false, message: 'Accountant not found' });
    }
    
    res.json({ success: true, data: accountant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
