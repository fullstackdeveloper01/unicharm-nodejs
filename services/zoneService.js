const db = require('../models');
const { Zone, Unit } = db;

exports.getAllZones = async () => Zone.findAll({
    where: { IsDeleted: false },
    include: [{ model: Unit, as: 'unit' }]
});
exports.getZoneById = async (id) => Zone.findByPk(id, { include: [{ model: Unit, as: 'unit' }] });
exports.createZone = async (data) => Zone.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateZone = async (item, data) => item.update(data);
exports.deleteZone = async (item) => item.update({ IsDeleted: true });
