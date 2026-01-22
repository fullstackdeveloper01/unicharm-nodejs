const db = require('../models');
const { MeetingRequest, Room, Employee } = db;

exports.getAllRequests = async () => {
    const requests = await MeetingRequest.findAll({
        where: { IsDeleted: false },
        include: [
            {
                model: Room,
                as: 'room',
                include: [{ model: db.Location, as: 'location', attributes: ['LocationName'] }]
            },
            {
                model: Employee,
                as: 'bookedBy',
                include: [{ model: db.Department, as: 'department', attributes: ['DepartmentName'] }]
            }
        ],
        order: [['StartTime', 'DESC']]
    });

    return requests.map(req => {
        const r = req.toJSON();
        const deptName = r.bookedBy && r.bookedBy.department ? r.bookedBy.department.DepartmentName : '';
        const locName = r.room && r.room.location ? r.room.location.LocationName : '';

        // Overwrite nested properties for Name display
        if (r.room) {
            r.room.Location = locName || r.room.Location;
            r.room.LocationName = locName;
        }
        if (r.bookedBy) {
            r.bookedBy.Department = deptName || r.bookedBy.Department; // If Department was ID
            r.bookedBy.DepartmentId = deptName || r.bookedBy.DepartmentId; // Overwrite ID
            r.bookedBy.DepartmentName = deptName;
        }

        return {
            ...r,
            Department: deptName || r.Department,
            DepartmentName: deptName,
            Location: locName || r.Location,
            LocationName: locName,
            UserName: r.bookedBy ? `${r.bookedBy.FirstName} ${r.bookedBy.LastName}` : ''
        };
    });
};

exports.getRequestById = async (id) => {
    return await MeetingRequest.findByPk(id, {
        include: [
            { model: Room, as: 'room' },
            { model: Employee, as: 'bookedBy' }
        ]
    });
};

exports.createRequest = async (data) => {
    return await MeetingRequest.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
};

exports.updateRequest = async (request, data) => {
    return await request.update(data);
};

exports.deleteRequest = async (request) => {
    return await request.update({ IsDeleted: true });
};
