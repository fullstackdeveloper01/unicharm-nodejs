const db = require('../../models');
const { Group } = db;

const { Op } = require('sequelize');

exports.getAllGroups = async (page = 1, limit = null, search = '') => {
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

    const { count, rows } = await Group.findAndCountAll(queryOptions);

    const mappedRows = rows.map(g => {
        const plain = g.get({ plain: true });
        return plain;
    });

    return { count, rows: mappedRows };
};

exports.getGroupById = async (id) => {
    return await Group.findByPk(id);
};

exports.createGroup = async (data) => {
    const existing = await Group.findOne({
        where: {
            Title: data.Title,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });
    if (existing) {
        throw new Error('Group with this title already exists');
    }

    const groupData = { ...data, CreatedOn: new Date(), IsDeleted: false };
    return await Group.create(groupData);
};

exports.updateGroup = async (item, data) => {
    if (data.Title && data.Title !== item.Title) {
        const existing = await Group.findOne({
            where: {
                Title: data.Title,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: item.Id }
            }
        });
        if (existing) {
            throw new Error('Group with this title already exists');
        }
    }

    const updateData = { ...data };

    return await item.update(updateData);
};

exports.deleteGroup = async (item) => item.update({ IsDeleted: true });
