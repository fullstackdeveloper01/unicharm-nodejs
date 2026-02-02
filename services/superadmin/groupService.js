const db = require('../../models');
const { Group } = db;

const { Op } = require('sequelize');

exports.getAllGroups = async (page = 1, limit = null) => {
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
        }
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const { count, rows } = await Group.findAndCountAll(queryOptions);

    const mappedRows = rows.map(g => {
        const plain = g.get({ plain: true });
        try { plain.Members = JSON.parse(plain.Members || '[]'); } catch (e) { plain.Members = []; }
        return plain;
    });

    return { count, rows: mappedRows };
};

exports.getGroupById = async (id) => {
    return await Group.findByPk(id);
};

exports.createGroup = async (data) => {
    const groupData = { ...data, Members: JSON.stringify(data.Members || []), CreatedOn: new Date(), IsDeleted: false };
    return await Group.create(groupData);
};

exports.updateGroup = async (item, data) => {
    const updateData = { ...data };
    if (updateData.Members) updateData.Members = JSON.stringify(updateData.Members);
    return await item.update(updateData);
};

exports.deleteGroup = async (item) => item.update({ IsDeleted: true });
