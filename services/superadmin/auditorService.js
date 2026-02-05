const db = require('../../models');
const { Auditor, Unit, Zone, ExpenseLocation } = db;
const { Op } = require('sequelize');

exports.getAllAuditors = async (page = 1, limit = null, filters = {}) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = { IsDeleted: false };

    if (filters.unitId) whereClause.Unit = filters.unitId;
    if (filters.zoneId) whereClause.Zone = filters.zoneId;
    if (filters.locationId) whereClause.Location = filters.locationId;

    // Add search functionality
    if (filters.search) {
        whereClause[Op.or] = [
            { FirstName: { [Op.like]: `%${filters.search}%` } },
            { LastName: { [Op.like]: `%${filters.search}%` } },
            { Email: { [Op.like]: `%${filters.search}%` } }
        ];
    }

    const queryOptions = {
        where: whereClause,
        include: [
            { model: Unit, as: 'unit', attributes: ['Id', 'Title'] },
            { model: Zone, as: 'zone', attributes: ['Id', 'Title'] },
            { model: ExpenseLocation, as: 'expenseLocation', attributes: ['Id', 'Title'] }
        ],
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return Auditor.findAndCountAll(queryOptions);
};
exports.getAuditorById = async (id) => Auditor.findByPk(id, {
    include: [
        { model: Unit, as: 'unit', attributes: ['Id', 'Title'] },
        { model: Zone, as: 'zone', attributes: ['Id', 'Title'] },
        { model: ExpenseLocation, as: 'expenseLocation', attributes: ['Id', 'Title'] }
    ]
});
exports.createAuditor = async (data) => {
    if (data.Email) {
        const existing = await Auditor.findOne({
            where: {
                Email: data.Email,
                IsDeleted: { [Op.or]: [false, 0, null] }
            }
        });
        if (existing) {
            throw new Error('Auditor with this email already exists');
        }
    }
    return Auditor.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};
exports.updateAuditor = async (item, data) => {
    if (data.Email && data.Email !== item.Email) {
        const existing = await Auditor.findOne({
            where: {
                Email: data.Email,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });
        if (existing) {
            throw new Error('Auditor with this email already exists');
        }
    }
    return item.update(data);
};
exports.deleteAuditor = async (item) => item.update({ IsDeleted: true });
