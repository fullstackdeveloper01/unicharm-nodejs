const db = require('../../models');
const { MeetingRequest, Room, Employee } = db;
const { Op } = require('sequelize');

exports.getAllRequests = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: {
            IsDeleted: {
                [Op.or]: [
                    { [Op.eq]: 0 },
                    { [Op.eq]: false },
                    { [Op.is]: null },
                    { [Op.eq]: '0' },
                    { [Op.eq]: 'false' }
                ]
            }
        },
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
        order: [['CreatedOn', 'DESC']]
    };

    if (search) {
        queryOptions.where[Op.or] = [
            { Title: { [Op.like]: `%${search}%` } },
            { Purpose: { [Op.like]: `%${search}%` } }
        ];
    }

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const { count, rows } = await MeetingRequest.findAndCountAll(queryOptions);

    const mappedRows = rows.map(req => {
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

    return { count, rows: mappedRows };
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
