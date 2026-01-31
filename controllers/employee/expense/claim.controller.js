

// --- Business Logic (Merged) ---

const { Employee } = require('../../../models/superAdmin');


const getAllClaims = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: { IsDeleted: false },
        include: [{ model: Employee, as: 'employee' }]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Claim.findAndCountAll(queryOptions);
};
const getClaimById = async (id) => Claim.findByPk(id, { include: [{ model: Employee, as: 'employee' }] });
const createClaim = async (data) => Claim.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateClaim = async (item, data) => item.update(data);
const deleteClaim = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllClaims = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const result = await getAllClaims(page, limit);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Claims retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getClaimById = async (req, res) => {
    try {
        const data = await getClaimById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Claim retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createClaim = async (req, res) => {
    try {
        const data = await createClaim(req.body);
        res.status(201);
        sendResponse(res, true, 'Claim created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateClaim = async (req, res) => {
    try {
        const item = await getClaimById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateClaim(item, req.body);
        sendResponse(res, true, 'Claim updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteClaim = async (req, res) => {
    try {
        const item = await getClaimById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteClaim(item);
        sendResponse(res, true, 'Claim deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
