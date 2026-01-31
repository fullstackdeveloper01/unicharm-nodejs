const { Location, Floor, Room, MeetingRequest, Employee } = require('../../../models');
const { Op } = require('sequelize');

const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({ success, message, data });
};

// GET Location List
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.findAll({
            where: {
                [Op.or]: [
                    { IsDeleted: false },
                    { IsDeleted: null }
                ]
            }
        });
        return sendResponse(res, 200, true, 'Locations fetched', locations);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// GET Floor List by Location
exports.getFloors = async (req, res) => {
    try {
        const { locationId } = req.query;
        if (!locationId) return sendResponse(res, 400, false, 'LocationId required');

        const floors = await Floor.findAll({
            where: {
                LocationId: locationId,
                [Op.or]: [
                    { IsDeleted: false },
                    { IsDeleted: null }
                ]
            }
        });
        return sendResponse(res, 200, true, 'Floors fetched', floors);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// GET Room List by Floor
exports.getRooms = async (req, res) => {
    try {
        const { floorId } = req.query;
        if (!floorId) return sendResponse(res, 400, false, 'FloorId required');

        const rooms = await Room.findAll({
            where: {
                FloorId: floorId,
                [Op.or]: [
                    { IsDeleted: false },
                    { IsDeleted: null }
                ]
            }
        });
        return sendResponse(res, 200, true, 'Rooms fetched', rooms);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// GET Calendar Schedule
exports.getSchedule = async (req, res) => {
    try {
        const { locationId, floorId, roomId, startDate, endDate } = req.query;

        const whereClause = {
            [Op.or]: [
                { IsDeleted: { [Op.ne]: 'true' } },
                { IsDeleted: null }
            ],
            Status: {
                [Op.or]: ['APPROVE', 'APPROVED', 'Pending']
            }
        };

        if (roomId) whereClause.RoomId = roomId;
        // Location and Floor are relations via Room usually, but MeetingRequest has direct columns in schema?
        // My updated model has LocationId and FloorId.
        if (locationId) whereClause.LocationId = locationId;
        if (floorId) whereClause.FloorId = floorId;

        // Date range filter
        // stored as String 'YYYY-MM-DD' in 'Date' column based on schema.
        if (startDate && endDate) {
            whereClause.Date = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            whereClause.Date = { [Op.gte]: startDate };
        }

        const meetings = await MeetingRequest.findAll({
            where: whereClause,
            include: [
                { model: Employee, as: 'bookedBy', attributes: ['FirstName', 'LastName'] },
                { model: Room, as: 'room', attributes: ['RoomName'] }
            ]
        });

        console.log(`Debug: Found ${meetings.length} meetings for query`, whereClause);

        // Format for calendar (e.g., FullCalendar format or custom)
        const formatted = meetings.map(m => {
            const userName = m.bookedBy ? `${m.bookedBy.FirstName} ${m.bookedBy.LastName || ''}`.trim() : '';
            return {
                id: m.Id,
                title: m.Purpose || userName,
                start: `${m.Date}T${formatTime(m.TimeFrom)}`,
                end: `${m.Date}T${formatTime(m.TimeTo)}`,
                resourceId: m.RoomId,
                extendedProps: {
                    user: userName,
                    room: m.room ? m.room.RoomName : '',
                    status: m.Status
                }
            };
        });

        console.log(`Debug: Returning ${formatted.length} formatted events.`);

        return sendResponse(res, 200, true, 'Schedule fetched', formatted);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, error.message);
    }
};

function formatTime(doubleTime) {
    // 12.5 -> 12:30, 10 -> 10:00
    if (doubleTime == null) return '00:00';
    const hours = Math.floor(doubleTime);
    const minutes = Math.round((doubleTime - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}
