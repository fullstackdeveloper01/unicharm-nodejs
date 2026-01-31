const { Op } = require('sequelize');


// --- Business Logic (Merged) ---


const { Role } = require('../../models/superAdmin');


const getAllRoles = async (page = 1, limit = 10) => {
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

    if (limit) {
        queryOptions.limit = limit;
        queryOptions.offset = (page - 1) * limit;
    }

    return await Role.findAndCountAll(queryOptions);
};

const getRoleById = async (id) => {
    return await Role.findByPk(id);
};

const createRole = async (data) => {
    return await Role.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

const updateRole = async (role, data) => {
    return await role.update(data);
};

const deleteRole = async (role) => {
    return await role.update({ IsDeleted: true });
};

const selectRoles = async () => {
    const roles = await Role.findAll({
        where: { IsDeleted: false },
        attributes: ['Id', 'RoleName']
    });
    return roles.map(role => ({ value: role.Id, text: role.RoleName }));
};

// -----------------------------


// Helper for standard response
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

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const result = await getAllRoles(page, limit);

    const pagination = {
      total: result.count,
      page: page,
      limit: limit || result.count,
      totalPages: limit ? Math.ceil(result.count / limit) : 1,
      hasNext: limit ? page * limit < result.count : false
    };

    sendResponse(res, true, 'Roles retrieved successfully', result.rows, null, pagination);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve roles', null, { message: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);

    if (!role) {
      return sendResponse(res, false, 'Role not found');
    }

    sendResponse(res, true, 'Role retrieved successfully', role);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve role', null, { message: error.message });
  }
};

// Create role
exports.createRole = async (req, res) => {
  try {
    const { RoleName } = req.body;

    if (!RoleName) {
      return sendResponse(res, false, 'Role name is required');
    }

    const role = await createRole({ RoleName });
    res.status(201);
    sendResponse(res, true, 'Role created successfully', role);
  } catch (error) {
    sendResponse(res, false, 'Failed to create role', null, { message: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { RoleName } = req.body;

    const role = await getRoleById(id);
    if (!role) {
      return sendResponse(res, false, 'Role not found');
    }

    const updatedRole = await updateRole(role, { RoleName });
    sendResponse(res, true, 'Role updated successfully', updatedRole);
  } catch (error) {
    sendResponse(res, false, 'Failed to update role', null, { message: error.message });
  }
};

// Delete role (soft delete)
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);

    if (!role) {
      return sendResponse(res, false, 'Role not found');
    }

    await deleteRole(role);
    sendResponse(res, true, 'Role deleted successfully');
  } catch (error) {
    sendResponse(res, false, 'Failed to delete role', null, { message: error.message });
  }
};

// Helper method for dropdown
exports.selectRoles = async (req, res) => {
  try {
    const dropdown = await selectRoles();
    sendResponse(res, true, 'Roles dropdown retrieved successfully', dropdown);
  } catch (error) {
    sendResponse(res, false, 'Failed to retrieve roles dropdown', null, { message: error.message });
  }
};
