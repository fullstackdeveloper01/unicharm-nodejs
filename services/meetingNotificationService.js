const db = require('../models');
const { MeetingNotification } = db;

const { Op } = require('sequelize');

exports.getAllNotifications = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        include: [{
            model: db.Employee,
            as: 'employee',
            attributes: ['Id', 'FirstName', 'LastName', 'EmpId']
        }],
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await MeetingNotification.findAndCountAll(queryOptions);
};

exports.getNotificationById = async (id) => {
    return await MeetingNotification.findByPk(id);
};

exports.createNotification = async (data) => {
    return await MeetingNotification.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateNotification = async (notification, data) => {
    return await notification.update(data);
};

exports.deleteNotification = async (notification) => {
    return await notification.update({ IsDeleted: true });
};
