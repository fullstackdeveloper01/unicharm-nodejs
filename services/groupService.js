const db = require('../models');
const { Group } = db;

const { Op } = require('sequelize');

exports.getAllGroups = async () => {
    const groups = await Group.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        }
    });
    return groups.map(g => {
        const plain = g.get({ plain: true });
        try { plain.Members = JSON.parse(plain.Members || '[]'); } catch (e) { plain.Members = []; }
        return plain;
    });
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
