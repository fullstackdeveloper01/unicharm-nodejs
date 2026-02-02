const db = require('../models');
const { Room, Floor } = db;

const { Op } = require('sequelize');

exports.getAllRooms = async (page = 1, limit = null, search = '') => {
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

    if (search) whereClause.RoomName = { [Op.like]: `%${search}%` };

    const queryOptions = {
        where: whereClause,
        include: [{ model: Floor, as: 'floor' }]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Room.findAndCountAll(queryOptions);
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
