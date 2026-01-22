const db = require('../models');
const { Auditor, Unit, Zone, Location } = db;

exports.getAllAuditors = async () => Auditor.findAll({
    where: { IsDeleted: false },
    include: [
        { model: Unit, as: 'unit' },
        { model: Zone, as: 'zone' },
        { model: Location, as: 'location' }
    ]
});
exports.getAuditorById = async (id) => Auditor.findByPk(id, {
    include: [
        { model: Unit, as: 'unit' },
        { model: Zone, as: 'zone' },
        { model: Location, as: 'location' }
    ]
});
exports.createAuditor = async (data) => Auditor.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateAuditor = async (item, data) => item.update(data);
exports.deleteAuditor = async (item) => item.update({ IsDeleted: true });
