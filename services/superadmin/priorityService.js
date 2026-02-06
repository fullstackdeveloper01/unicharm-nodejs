const db = require('../../models');
const { PriorityMaster } = db;

const { Op } = require('sequelize');

exports.getAllPriorities = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    // Add search functionality
    if (search) {
        whereClause[Op.and] = [
            {
                [Op.or]: [
                    { Title: { [Op.like]: `%${search}%` } },
                    { Description: { [Op.like]: `%${search}%` } }
                ]
            }
        ];
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return PriorityMaster.findAndCountAll(queryOptions);
};
exports.getPriorityById = async (id) => PriorityMaster.findByPk(id);
exports.createPriority = async (data) => {
    const title = (data.Title || '').trim();

    const existing = await PriorityMaster.findOne({
        where: {
            Title: title,
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: 0 }
            ]
        }
    });

    if (existing) {
        throw new Error('Priority with this title already exists');
    }
    return PriorityMaster.create({ ...data, Title: title, CreatedOn: new Date(), IsDeleted: false });
};
exports.updatePriority = async (item, data) => {
    let updateTitle = item.Title;
    if (data.Title) {
        updateTitle = data.Title.trim();
    }

    if (updateTitle !== item.Title) {
        const existing = await PriorityMaster.findOne({
            where: {
                Title: updateTitle,
                [Op.or]: [{ IsDeleted: false }, { IsDeleted: 0 }],
                Id: { [Op.ne]: item.Id }
            }
        });

        if (existing) {
            throw new Error('Priority with this title already exists');
        }
    }

    // Update data with trimmed title if present
    const updateData = { ...data };
    if (data.Title) updateData.Title = updateTitle;

    return item.update(updateData);
};
exports.deletePriority = async (item) => item.update({ IsDeleted: true });
