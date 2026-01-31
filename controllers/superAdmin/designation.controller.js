const { Op } = require('sequelize');
const { Designation, Department } = require('../../models/superAdmin');

// --- Business Logic ---

/**
 * Get department by ID (inline from service)
 * @param {number} id 
 * @returns {Promise<Object>}
 */
const getDepartmentById = async (id) => {
  try {
    const department = await Department.findByPk(id);
    return department;
  } catch (error) {
    console.error('Error in getDepartmentById:', error);
    throw error;
  }
};

/**
 * Get all designations
 * @returns {Promise<Array>} List of designations
 */
const getAllDesignations = async (page = 1, limit = null) => {
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
    include: [
      { model: Department, as: 'department', attributes: ['Id', 'DepartmentName'] }
    ],
    order: [['CreatedOn', 'DESC']]
  };

  if (limitNumber) {
    queryOptions.limit = limitNumber;
    queryOptions.offset = (pageNumber - 1) * limitNumber;
  }

  return await Designation.findAndCountAll(queryOptions);
};

/**
 * Get designation by ID
 * @param {number} id - Designation ID
 * @returns {Promise<Object>} Designation
 */
const getDesignationById = async (id) => {
  return await Designation.findByPk(id, {
    include: [{ model: Department, as: 'department' }]
  });
};

/**
 * Create designation
 * @param {Object} data - Designation data
 * @returns {Promise<Object>} Created designation
 */
const createDesignationRecord = async (data) => {
  return await Designation.create({
    ...data,
    DepartmentId: data.DepartmentId || null,
    CreatedOn: new Date(),
    IsDeleted: false
  });
};

/**
 * Update designation
 * @param {Object} designation - Designation instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated designation
 */
const updateDesignationRecord = async (designation, data) => {
  return await designation.update(data);
};

/**
 * Delete designation (soft delete)
 * @param {Object} designation - Designation instance
 * @returns {Promise<Object>} Deleted designation
 */
const deleteDesignationRecord = async (designation) => {
  return await designation.update({ IsDeleted: true });
};

/**
 * Get designations for dropdown
 * @returns {Promise<Array>} Dropdown items
 */
const selectDesignationsDropdown = async () => {
  const designations = await Designation.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DesignationName']
  });
  return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};

/**
 * Get expense designations for dropdown
 * @returns {Promise<Array>} Dropdown items
 */
const selectExpenseDesignationsDropdown = async () => {
  const designations = await Designation.findAll({
    where: { IsDeleted: false },
    attributes: ['Id', 'DesignationName']
  });
  return designations.map(des => ({ value: des.Id, text: des.DesignationName }));
};

// --- Helper for standard response ---
const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
  const response = { success, message, data, errors };
  if (pagination) response.pagination = pagination;
  res.json(response);
};

// --- Controller Methods ---

// Get all designations
exports.getAllDesignations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const result = await getAllDesignations(page, limit);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Designations retrieved successfully', result.rows, null, pagination);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designations', null, { message: error.message });
  }
};

// Get designation by ID
exports.getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await getDesignationById(id);

    if (!designation) {
      return sendResponse(res, false, 'Designation not found');
    }

    sendResponse(res, true, 'Designation retrieved successfully', designation);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designation', null, { message: error.message });
  }
};

// Create designation
exports.createDesignation = async (req, res) => {
  try {
    const { DesignationName, DepartmentId, Category } = req.body;

    if (!DesignationName) {
      return sendResponse(res, false, 'Designation name is required');
    }

    if (DepartmentId) {
      const dept = await getDepartmentById(DepartmentId);
      if (!dept) {
        return sendResponse(res, false, 'Department not found');
      }
    }

    const designation = await createDesignationRecord({ DesignationName, DepartmentId, Category });
    res.status(201);
    sendResponse(res, true, 'Designation created successfully', designation);
  } catch (error) {
    sendResponse(res, false, 'Failed to create designation', null, { message: error.message });
  }
};

// Update designation
exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { DesignationName, DepartmentId, Category } = req.body;

    const designation = await getDesignationById(id);
    if (!designation) {
      return sendResponse(res, false, 'Designation not found');
    }

    if (DepartmentId) {
      const dept = await getDepartmentById(DepartmentId);
      if (!dept) {
        return sendResponse(res, false, 'Department not found');
      }
    }

    const updatedDesignation = await updateDesignationRecord(designation, { DesignationName, DepartmentId, Category });
    sendResponse(res, true, 'Designation updated successfully', updatedDesignation);
  } catch (error) {
    sendResponse(res, false, 'Failed to update designation', null, { message: error.message });
  }
};

// Delete designation (soft delete)
exports.deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await getDesignationById(id);

    if (!designation) {
      return sendResponse(res, false, 'Designation not found');
    }

    await deleteDesignationRecord(designation);
    sendResponse(res, true, 'Designation deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete designation', null, { message: error.message });
  }
};

// Helper methods for dropdowns
exports.selectDesignations = async (req, res) => {
  try {
    const dropdown = await selectDesignationsDropdown();
    sendResponse(res, true, 'Designations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve designations dropdown', null, { message: error.message });
  }
};

exports.selectExpenseDesignations = async (req, res) => {
  try {
    const dropdown = await selectExpenseDesignationsDropdown();
    sendResponse(res, true, 'Expense designations dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve expense designations dropdown', null, { message: error.message });
  }
};
