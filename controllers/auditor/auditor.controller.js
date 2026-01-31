
const { Op } = require('sequelize');

// --- Business Logic (Merged) ---

const { Auditor } = require('../../models/auditor');
const { Unit, Zone, Location } = require('../../models/superAdmin');



const getAllAuditors = async (page = 1, limit = null, filters = {}) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };

    if (filters.unitId) whereClause.UnitId = filters.unitId;
    if (filters.zoneId) whereClause.ZoneId = filters.zoneId;
    if (filters.locationId) whereClause.LocationId = filters.locationId;

    // Add search functionality
    if (filters.search) {
        whereClause.Name = { [Op.like]: `%${filters.search}%` };
    }

    const queryOptions = {
        where: whereClause,
        include: [
            { model: Unit, as: 'unit' },
            { model: Zone, as: 'zone' },
            { model: Location, as: 'location' }
        ]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Auditor.findAndCountAll(queryOptions);
};
const getAuditorById = async (id) => Auditor.findByPk(id, {
    include: [
        { model: Unit, as: 'unit' },
        { model: Zone, as: 'zone' },
        { model: Location, as: 'location' }
    ]
});
const createAuditor = async (data) => Auditor.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
const updateAuditor = async (item, data) => item.update(data);
const deleteAuditor = async (item) => item.update({ IsDeleted: true });

// -----------------------------

const sendResponse = (res, success, message, data = null, errors = null, pagination = null) => {
    const response = { success, message, data, errors };
    if (pagination) response.pagination = pagination;
    res.json(response);
};

exports.getAllAuditors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const filters = {
            unitId: req.query.unitId,
            zoneId: req.query.zoneId,
            locationId: req.query.locationId,
            search: req.query.search || ''
        };

        const result = await getAllAuditors(page, limit, filters);

        const pagination = {
            total: result.count,
            page: page,
            limit: limit || result.count,
            totalPages: limit ? Math.ceil(result.count / limit) : 1,
            hasNext: limit ? page * limit < result.count : false
        };

        sendResponse(res, true, 'Auditors retrieved', result.rows, null, pagination);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.getAuditorById = async (req, res) => {
    try {
        const data = await getAuditorById(req.params.id);
        if (!data) return sendResponse(res, false, 'Not found');
        sendResponse(res, true, 'Auditor retrieved', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.createAuditor = async (req, res) => {
    try {
        const data = await createAuditor(req.body);
        res.status(201);
        sendResponse(res, true, 'Auditor created', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.updateAuditor = async (req, res) => {
    try {
        const item = await getAuditorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        const data = await updateAuditor(item, req.body);
        sendResponse(res, true, 'Auditor updated', data);
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};

exports.deleteAuditor = async (req, res) => {
    try {
        const item = await getAuditorById(req.params.id);
        if (!item) return sendResponse(res, false, 'Not found');
        await deleteAuditor(item);
        sendResponse(res, true, 'Auditor deleted');
    } catch (e) { sendResponse(res, false, 'Failed', null, { message: e.message }); }
};
