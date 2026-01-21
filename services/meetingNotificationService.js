const db = require('../models');
const { MeetingNotification } = db;

const { Op } = require('sequelize');

exports.getAllNotifications = async () => {
    return await MeetingNotification.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });
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
