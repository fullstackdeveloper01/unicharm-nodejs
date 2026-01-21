const db = require('../models');
const { Room, Floor } = db;

const { Op } = require('sequelize');

exports.getAllRooms = async () => {
    return await Room.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        include: [{ model: Floor, as: 'floor' }]
    });
};

exports.getRoomById = async (id) => {
    return await Room.findByPk(id, {
        include: [{ model: Floor, as: 'floor' }]
    });
};

exports.createRoom = async (data) => {
    return await Room.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateRoom = async (room, data) => {
    return await room.update(data);
};

exports.deleteRoom = async (room) => {
    return await room.update({ IsDeleted: true });
};
