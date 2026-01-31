const sequelize = require('../../config/database');
const { QueryTypes } = require('sequelize');

/**
 * Check login credentials using stored procedure
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Array>}
 */
const checkLogin = async (email, password) => {
    try {
        const results = await sequelize.query(
            'CALL CheckLogin(:email, :password)',
            {
                replacements: { email, password },
                type: QueryTypes.RAW
            }
        );
        return results;
    } catch (error) {
        console.error('Error in checkLogin SP:', error);
        throw error;
    }
};

/**
 * Get tickets for assignee
 * @param {number} employeeId 
 * @returns {Promise<Array>}
 */
const getTicketForAssignee = async (employeeId = null) => {
    try {
        if (employeeId) {
            const results = await sequelize.query(
                'CALL GetTicketForAssignee(:employeeId)',
                {
                    replacements: { employeeId },
                    type: QueryTypes.RAW
                }
            );
            return results;
        } else {
            const results = await sequelize.query(
                'CALL GetTicketForAssignee()',
                {
                    type: QueryTypes.RAW
                }
            );
            return results;
        }
    } catch (error) {
        console.error('Error in getTicketForAssignee SP:', error);
        throw error;
    }
};

/**
 * Get login details
 * @param {Object} params 
 * @returns {Promise<Array>}
 */
const getLoginDetail = async (params) => {
    try {
        const results = await sequelize.query(
            'CALL GetLoginDetail(:employeeId, :startDate, :endDate)',
            {
                replacements: {
                    employeeId: params.employeeId || null,
                    startDate: params.startDate || null,
                    endDate: params.endDate || null
                },
                type: QueryTypes.RAW
            }
        );
        return results;
    } catch (error) {
        console.error('Error in getLoginDetail SP:', error);
        throw error;
    }
};

/**
 * Get meetings for user
 * @param {number} employeeId 
 * @returns {Promise<Array>}
 */
const getMeetingsForUser = async (employeeId) => {
    try {
        const results = await sequelize.query(
            'CALL GetMeetingsForUser(:employeeId)',
            {
                replacements: { employeeId },
                type: QueryTypes.RAW
            }
        );
        return results;
    } catch (error) {
        console.error('Error in getMeetingsForUser SP:', error);
        throw error;
    }
};

module.exports = {
    checkLogin,
    getTicketForAssignee,
    getLoginDetail,
    getMeetingsForUser
};
