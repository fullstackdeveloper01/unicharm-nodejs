const db = require('../models');
const { Group } = db;

const { Op } = require('sequelize');

exports.getAllGroups = async () => Group.findAll({
    where: {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    }
});
exports.getGroupById = async (id) => Group.findByPk(id);
exports.createGroup = async (data) => Group.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateGroup = async (item, data) => item.update(data);
exports.deleteGroup = async (item) => item.update({ IsDeleted: true });
