const superAdminModels = require('./superAdmin');
const employeeIntraModels = require('./employee/intra');

// Export all models in a single object
module.exports = {
    // SuperAdmin models
    ...superAdminModels,

    // Employee Intra models
    ...employeeIntraModels,

    // Export sequelize instance
    sequelize: superAdminModels.sequelize,
    Sequelize: superAdminModels.Sequelize
};

