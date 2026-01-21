const db = require('../models');
const { sequelize } = db;

/**
 * Execute a stored procedure with parameters
 * @param {string} procedureName - Name of the stored procedure
 * @param {object} parameters - Parameters object (key-value pairs)
 * @returns {Promise} Query result
 */
exports.executeStoredProcedure = async (procedureName, parameters = {}) => {
  try {
    const paramKeys = Object.keys(parameters);

    if (paramKeys.length === 0) {
      return await this.executeStoredProcedureSimple(procedureName);
    }

    // Build parameter string for MySQL stored procedure
    // Format: CALL ProcedureName(:param1, :param2, ...)
    const paramPlaceholders = paramKeys.map(key => `:${key}`).join(', ');
    const query = `CALL ${procedureName}(${paramPlaceholders})`;

    // Execute with Sequelize raw query
    const results = await sequelize.query(query, {
      replacements: parameters,
      type: sequelize.QueryTypes.SELECT
    });

    // MySQL stored procedures return results in an array, get the first result set
    return Array.isArray(results) && results.length > 0 ? results[0] : results;
  } catch (error) {
    console.error(`Error executing stored procedure ${procedureName}:`, error);
    throw error;
  }
};

/**
 * Execute stored procedure without parameters
 * @param {string} procedureName - Name of the stored procedure
 * @returns {Promise} Query result
 */
exports.executeStoredProcedureSimple = async (procedureName) => {
  try {
    // MySQL uses CALL instead of EXEC
    const query = `CALL ${procedureName}()`;
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    // MySQL stored procedures return results in an array, get the first result set
    return Array.isArray(results) && results.length > 0 ? results[0] : results;
  } catch (error) {
    console.error(`Error executing stored procedure ${procedureName}:`, error);
    throw error;
  }
};

/**
 * Get Employees List using stored procedure
 */
exports.getEmployeesList = async () => {
  return await this.executeStoredProcedureSimple('USP_GetEmployeesList');
};

/**
 * Get Accountant using stored procedure
 */
exports.getAccountant = async () => {
  return await this.executeStoredProcedureSimple('USP_GetAccountant');
};

/**
 * Get Upcoming Birthdays using stored procedure
 */
exports.getUpComingBirthday = async () => {
  return await this.executeStoredProcedureSimple('USP_GetUpComingBirthday');
};

/**
 * Get Recent News using stored procedure
 */
exports.getRecentNews = async () => {
  return await this.executeStoredProcedure('USP_GetRecentNews', { Id: 0 });
};

/**
 * Get Recent Events using stored procedure
 */
exports.getRecentEvent = async () => {
  return await this.executeStoredProcedure('USP_GetRecentEvent', { Id: 0 });
};

/**
 * Get Recent Policies using stored procedure
 */
exports.getRecentPolicies = async () => {
  return await this.executeStoredProcedure('USP_GetRecentPolicies', { Id: 0 });
};

/**
 * Get Work Anniversary using stored procedure
 */
exports.getWorkAnniversary = async () => {
  return await this.executeStoredProcedure('USP_GetWorkAnniversary', { Id: 0 });
};

/**
 * Get Tickets for Assignee using stored procedure
 * @param {number} employeeId - Employee ID (optional)
 */
exports.getTicketForAssignee = async (employeeId = null) => {
  if (employeeId) {
    return await this.executeStoredProcedure('USP_GetTicketForAssignee', { EmployeeId: employeeId });
  }
  return await this.executeStoredProcedureSimple('USP_GetTicketForAssignee');
};

/**
 * Get Login Details using stored procedure
 * @param {object} params - Parameters object
 */
exports.getLoginDetail = async (params = {}) => {
  return await this.executeStoredProcedure('USP_GetLoginDetail', params);
};

/**
 * Get Meetings for User using stored procedure
 * @param {number} employeeId - Employee ID
 */
exports.getMeetingsForUser = async (employeeId) => {
  return await this.executeStoredProcedure('USP_GetMeetingsForUser', { EmployeeId: employeeId });
};

module.exports = exports;
