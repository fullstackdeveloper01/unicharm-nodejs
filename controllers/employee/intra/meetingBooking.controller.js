const { MeetingRequest, Room } = require('../../../models');
const { Op } = require('sequelize');

const sendResponse = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({ success, message, data });
};

// POST - Create New Meeting Booking
exports.createBooking = async (req, res) => {
    try {
        const {
            locationId,
            floorId,
            roomId,
            date,
            timeFrom, // double
            timeTo,   // double
            purpose,
            userId // explicit override, otherwise from token
        } = req.body;

        const effectiveUserId = (req.user && (req.user.id || req.user.Id)) || userId;

        if (!effectiveUserId) {
            // Optional: Fail if no user identified? Or allow anonymous if logic permits?
            // Ideally we need a user.
            // console.warn("No UserId found for booking");
        }

        // Basic Validation
        if (!roomId || !date || !timeFrom || !timeTo || !purpose) {
            return sendResponse(res, 400, false, 'Missing required fields');
        }

        // Check for Overlaps
        const overlap = await MeetingRequest.findOne({
            where: {
                RoomId: roomId,
                Date: date,
                IsDeleted: { [Op.ne]: 'true' },
                Status: { [Op.ne]: 'REJECT' }, // Assume if rejected it's free
                [Op.and]: [
                    { TimeFrom: { [Op.lt]: timeTo } },
                    { TimeTo: { [Op.gt]: timeFrom } }
                ]
            }
        });

        if (overlap) {
            return sendResponse(res, 409, false, 'Meeting room is already booked for this time slot.');
        }

        // Create
        const newBooking = await MeetingRequest.create({
            LocationId: locationId,
            FloorId: floorId,
            RoomId: roomId,
            Date: date, // 'YYYY-MM-DD'
            TimeFrom: timeFrom,
            TimeTo: timeTo,
            Purpose: purpose,
            UserId: effectiveUserId,
            Status: 'APPROVE',
            IsDeleted: 'false',
            CreatedOn: new Date().toISOString().replace('T', ' ').substring(0, 19) // 'YYYY-MM-DD HH:mm:ss' approx
        });

        return sendResponse(res, 201, true, 'Meeting booked successfully', newBooking);

    } catch (error) {
        console.error('Error creating booking:', error);
        return sendResponse(res, 500, false, 'Internal Server Error', error.message);
    }
};
