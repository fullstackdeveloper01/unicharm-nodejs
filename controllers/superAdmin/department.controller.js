
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Department } = require('../../models/superAdmin');



/**
 * Get all departments
 * @returns {Promise<Array>} List of departments
 */
const getAllDepartments = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Department.findAndCountAll(queryOptions);
};

/**
 * Get department by ID
 * @param {number} id - Department ID
 * @returns {Promise<Object>} Department
 */
const getDepartmentById = async (id) => {
    return await Department.findByPk(id);
};

/**
 * Create department
 * @param {Object} data - Department data
 * @returns {Promise<Object>} Created department
 */
const createDepartment = async (data) => {
    return await Department.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

/**
 * Update department
 * @param {Object} department - Department instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated department
 */
const updateDepartment = async (department, data) => {
    return await department.update(data);
};

/**
 * Delete department (soft delete)
 * @param {Object} department - Department instance
 * @returns {Promise<Object>} Deleted department
 */
const deleteDepartment = async (department) => {
    return await department.update({ IsDeleted: true });
};

/**
 * Get departments for dropdown
 * @returns {Promise<Array>} Dropdown items
 */
const selectDepartments = async () => {
    const departments = await Department.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'DepartmentName']
    });
    return departments.map(dept => ({ value: dept.Id, text: dept.DepartmentName }));
};

// -----------------------------


// Helper for standard response (could be shared, but copying for now to keep it self-contained as per instructions)
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
  const response = {
    success,
    message,
    data,
    errors
  };

  if (pagination) {
    response.pagination = pagination;
  }

  res.json(response);
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const result = await getAllDepartments(page, limit);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Departments retrieved successfully', result.rows, null, pagination);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve departments', null, { message: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await getDepartmentById(id);

    if (!department) {
      return sendResponse(res, false, 'Department not found');
    }

    sendResponse(res, true, 'Department retrieved successfully', department);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve department', null, { message: error.message });
  }
};

// Create department
// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { DepartmentName, CostCenter, Category } = req.body;

    if (!DepartmentName) {
      return sendResponse(res, false, 'Department name is required');
    }

    const department = await createDepartment({ DepartmentName, CostCenter, Category });
    res.status(201);
    sendResponse(res, true, 'Department created successfully', department);
  } catch (error) {
    sendResponse(res, false, 'Failed to create department', null, { message: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { DepartmentName, CostCenter, Category } = req.body;

    console.log(`Updating department ${id} with:`, { DepartmentName, CostCenter, Category });

    const department = await getDepartmentById(id);
    if (!department) {
      return sendResponse(res, false, 'Department not found');
    }

    const updatedDepartment = await updateDepartment(department, { DepartmentName, CostCenter, Category });
    sendResponse(res, true, 'Department updated successfully', updatedDepartment);
  } catch (error) {
    sendResponse(res, false, 'Failed to update department', null, { message: error.message });
  }
};

// Delete department (soft delete)
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await getDepartmentById(id);

    if (!department) {
      return sendResponse(res, false, 'Department not found');
    }

    await deleteDepartment(department);
    sendResponse(res, true, 'Department deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete department', null, { message: error.message });
  }
};

// Helper method for dropdown
exports.selectDepartments = async (req, res) => {
  try {
    const dropdown = await selectDepartments();
    sendResponse(res, true, 'Departments dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve departments dropdown', null, { message: error.message });
  }
};
