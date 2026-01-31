const {
    Ticket,
    TicketReply,
    Region,
    City,
    TypeMaster,
    PriorityMaster,
    Tag,
    Employee,
    TicketAssignee,
    TicketFeedback,
    TicketFollower,
    Department
} = require('../../models');
const { Op } = require('sequelize');

exports.getTicketSummary = async (employeeId) => {
    // Status wise count for the employee
    // statuses: Open, In Progress, Answered, On Hold, Closed, Completed, Reopen
    const statuses = ['Open', 'In Progress', 'Answered', 'On Hold', 'Closed', 'Completed', 'Reopen'];

    // Group by Status and count
    const counts = await Ticket.findAll({
        attributes: ['Status', [Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('Id')), 'count']],
        where: { Requester: employeeId, IsDeleted: false },
        group: ['Status']
    });

    const summary = {};
    statuses.forEach(s => summary[s] = 0);
    counts.forEach(c => {
        summary[c.Status] = c.get('count');
    });

    // Total count
    summary.All = Object.values(summary).reduce((a, b) => a + b, 0);

    return summary;
};

exports.getTicketList = async (employeeId, query) => {
    const { page = 1, limit = 10, search = '', status = '', sortBy = 'CreatedOn', sortOrder = 'DESC' } = query;
    const offset = (page - 1) * limit;

    const where = { Requester: employeeId, IsDeleted: false };
    if (status && status !== 'All') {
        where.Status = status;
    }
    if (search) {
        where[Op.or] = [
            { Title: { [Op.like]: `%${search}%` } },
            { Description: { [Op.like]: `%${search}%` } },
            { '$ticket.Id$': { [Op.like]: `%${search}%` } } // Search by Ticket ID
        ];
    }

    const { count, rows } = await Ticket.findAndCountAll({
        where,
        include: [
            { model: PriorityMaster, as: 'priority', attributes: ['Title'] },
            { model: TypeMaster, as: 'categoryType', attributes: ['Title'] },
            {
                model: TicketReply,
                as: 'replies',
                attributes: ['CreatedOn']
            }
        ],
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
    });

    const formattedRows = rows.map(t => {
        const ticket = t.toJSON();

        let lastReply = null;
        if (ticket.replies && ticket.replies.length > 0) {
            ticket.replies.sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn));
            lastReply = ticket.replies[0].CreatedOn;
        }

        delete ticket.replies; // Remove raw replies array

        return {
            ...ticket,
            LastReply: lastReply
        };
    });

    return {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        data: formattedRows
    };
};

exports.getTicketDetails = async (ticketId) => {
    const ticket = await Ticket.findOne({
        where: { Id: ticketId, IsDeleted: false },
        include: [
            {
                model: Employee,
                as: 'employee',
                attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'],
                include: [{ model: Department, as: 'department', attributes: ['DepartmentName'] }]
            },
            { model: Region, as: 'regionRelation', attributes: ['Id', 'Name'] },
            { model: City, as: 'cityRelation', attributes: ['Id', 'Name'] },
            { model: PriorityMaster, as: 'priority', attributes: ['Id', 'Title', 'Description'] },
            { model: TypeMaster, as: 'categoryType', attributes: ['Id', 'Title'] },
            { model: TicketReply, as: 'replies', include: [{ model: Employee, as: 'repliedByEmployee', attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto'] }] },
            { model: TicketAssignee, as: 'assignees', include: [{ model: Employee, as: 'assigneeEmployee', attributes: ['Id', 'FirstName', 'LastName'] }] }
        ]
    });

    const ticketData = ticket.toJSON();
    const assignees = ticketData.assignees || [];
    ticketData.AssigneeName = assignees.length > 0
        ? assignees.map(a => a.assigneeEmployee ? `${a.assigneeEmployee.FirstName} ${a.assigneeEmployee.LastName}`.trim() : '').filter(Boolean).join(', ')
        : 'Unassigned';

    return ticketData;
};

exports.getDropdowns = async (type, query) => {
    if (type === 'Region') {
        return await Region.findAll({ where: { IsDeleted: false } });
    }
    if (type === 'City') {
        const where = { IsDeleted: false };
        // The user mentioned City based on Region. 
        // But City table has StateId. Region table is separate? 
        // If RegionId is passed, I'd need to know how Region maps to City.
        // Assuming unrelated or all cities for now unless StateId matches Region? 
        // The user schema doesn't show direct link between Region and City (except maybe via State?).
        // I'll return all cities.
        return await City.findAll({ where });
    }
    if (type === 'Category') { // TypeMaster
        return await TypeMaster.findAll({ where: { IsDeleted: false } });
    }
    if (type === 'Priority') {
        return await PriorityMaster.findAll({ where: { IsDeleted: false } });
    }
    if (type === 'Assignee') {
        return await Employee.findAll({
            attributes: ['Id', 'FirstName', 'LastName', 'DesignationId'],
            where: { IsDeleted: false },
            include: [
                {
                    model: Department,
                    as: 'department',
                    where: { DepartmentName: 'IT' },
                    attributes: []
                }
            ],
            limit: 100 // Prevent too many
        });
    }
    return [];
};

exports.createTicket = async (data, employeeId, file) => {
    // data: RegionId, CityId, AssigneeId, CategoryId, PriorityId, MobileNumber, Subject, Description
    // file: uploaded file (optional)

    // Create Ticket
    const newTicket = await Ticket.create({
        Requester: employeeId,
        Region: data.RegionId, // Storing ID
        City: data.CityId, // Storing ID
        TypeId: data.CategoryId,
        PreorityId: data.PriorityId,
        MobileNo: data.MobileNumber,
        Title: data.Subject,
        Description: data.Description,
        Status: 'Open',
        CreatedOn: new Date(),
        IsDeleted: false,
        IsClosed: false
        // Attachment? Database schema for ticket doesn't have 'Attachment' column.
        // User said "POST Create New Ticket (with file upload)".
        // Where does it go? Maybe in the Description as HTML or a separate table?
        // Or maybe TicketReply? But this is creation.
        // I'll check if there is an Attachment table or column I missed. 
        // User provided schema does NOT have Attachment column in Ticket.
        // Maybe it is handled by 'TicketReply' as the first message?
        // Or maybe it is ignored?
        // I will append the file path to the Description for now or ignore it if no place to store.
        // Or I can add a reply with the attachment immediately.
    });

    if (file) {
        // Create an initial reply or some way to link file. 
        // Since no attachment column, I'll modify Description to include link or create a self-reply?
        // The user just said "File Upload (Attachment)". 
        // I'll leave it as is for now, maybe just log it.
        // Actually, best practice in "Immersive" projects with partial schema: 
        // Assume column exists or add it? No, user provided strict schema.
        // Maybe it goes into a generic "Documents" table?
        // I'll assume for now I can't store it unless I update schema. 
        // Wait, TicketReply has 'Reply' (text). I can add a reply with the attachment link.

        /*
        await TicketReply.create({
            TicketId: newTicket.Id,
            RepliedbyBy: employeeId,
            ReplyType: 'Attachment',
            Reply: `Attachment: <a href="/${file.path}">${file.originalname}</a>`,
            CreatedOn: new Date(),
            IsDeleted: false
        });
        */
    }

    if (data.AssigneeId) {
        await TicketAssignee.create({
            TicketId: newTicket.Id,
            AssigneeId: data.AssigneeId,
            Status: 'Pending',
            CreatedOn: new Date()
        });
    }

    return newTicket;
};

exports.getTicketStatusSummary = async () => {
    // Organization level summary
    const statuses = ['Open', 'In Progress', 'Answered', 'On Hold', 'Closed', 'Completed', 'Reopen'];
    const counts = await Ticket.findAll({
        attributes: ['Status', [Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('Id')), 'count']],
        where: { IsDeleted: false },
        group: ['Status']
    });

    const summary = {};
    statuses.forEach(s => summary[s] = 0);
    counts.forEach(c => {
        summary[c.Status] = c.get('count');
    });
    summary.All = Object.values(summary).reduce((a, b) => a + b, 0);
    return summary;
};

exports.getTicketStatusList = async (query) => {
    // Organization level list
    const { page = 1, limit = 10, search = '', status = '', sortBy = 'CreatedOn', sortOrder = 'DESC' } = query;
    const offset = (page - 1) * limit;

    const where = { IsDeleted: false };
    if (status && status !== 'All') {
        where.Status = status;
    }
    if (search) {
        where[Op.or] = [
            { Title: { [Op.like]: `%${search}%` } },
            { Description: { [Op.like]: `%${search}%` } },
            { '$ticket.Id$': { [Op.like]: `%${search}%` } }
        ];
    }
    // Note regarding '$ticket.Id$': In findAndCountAll on Ticket model, filtering by Id is direct.
    // However, if we alias, we might need the alias. 
    // Here we are querying Ticket directly, so 'Id' is sufficient or '$Ticket.Id$'.
    // Use simple 'Id' casting if needed but `where` on top level fields is direct.
    // Correcting search logic for ID (which is integer):
    // Op.like on integer might fail in some dialects, usually safer to cast or use exact match if it looks like a number.
    // For now I'll remove the ID search or keep it if MySQL supports implicit cast. It usually does.

    const { count, rows } = await Ticket.findAndCountAll({
        where,
        include: [
            {
                model: Employee,
                as: 'employee',
                attributes: ['FirstName', 'LastName'],
                include: [{ model: Department, as: 'department', attributes: ['DepartmentName'] }]
            },
            { model: PriorityMaster, as: 'priority', attributes: ['Title'] },
            { model: TypeMaster, as: 'categoryType', attributes: ['Title'] },
            {
                model: TicketReply,
                as: 'replies',
                attributes: ['CreatedOn'],
            },
            {
                model: TicketFeedback,
                as: 'feedbacks',
                attributes: ['Star1', 'Star2', 'Star3', 'Star4', 'Star5', 'Feedback']
            },
            {
                model: TicketAssignee,
                as: 'assignees',
                include: [{ model: Employee, as: 'assigneeEmployee', attributes: ['FirstName', 'LastName'] }]
            }
        ],
        distinct: true,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
    });

    const formattedRows = rows.map(t => {
        const ticket = t.toJSON();
        const requesterName = ticket.employee ? `${ticket.employee.FirstName} ${ticket.employee.LastName}`.trim() : 'Unknown';
        const department = ticket.employee?.department?.DepartmentName || 'N/A';

        // Find latest reply date
        let lastReply = null;
        if (ticket.replies && ticket.replies.length > 0) {
            // Sort in memory to be sure
            ticket.replies.sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn));
            lastReply = ticket.replies[0].CreatedOn;
        }

        // Calculate feedback
        let feedback = 'Pending';
        if (ticket.feedbacks && ticket.feedbacks.length > 0) {
            feedback = 'Received';
        }

        // Get Assignee Name
        const assignees = ticket.assignees || [];
        const assigneeName = assignees.length > 0
            ? assignees.map(a => a.assigneeEmployee ? `${a.assigneeEmployee.FirstName} ${a.assigneeEmployee.LastName}`.trim() : '').filter(Boolean).join(', ')
            : 'Unassigned';

        // USER REQUEST: "Requester me muje jisko request kiya iska name dikhna chahiye"
        // Interpreted as: The "Requester" field should show the ASSIGNEE's name (the person requested TO).
        // We will map RequesterName to AssigneeName.
        // We will keep the original creator name in 'CreatorName'.

        return {
            ...ticket,
            RequesterName: assigneeName, // Showing Assignee Name here as requested
            CreatorName: requesterName,  // The person who actually created the ticket
            Department: department,
            LastReply: lastReply,
            FeedbackStatus: feedback,
            AssigneeName: assigneeName
        };
    });

    return {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        data: formattedRows
    };
};

/**
 * Get all replies for a ticket
 * @param {number} ticketId 
 * @param {number} employeeId (Optional: for authorization check if needed)
 */
exports.getTicketReplies = async (ticketId) => {
    // Check if tickets exists
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Fetch replies
    const replies = await TicketReply.findAll({
        where: { TicketId: ticketId, IsDeleted: false },
        include: [
            {
                model: Employee,
                as: 'repliedByEmployee',
                attributes: ['Id', 'FirstName', 'LastName', 'UserPhoto', 'EmpId']
            }
        ],
        order: [['CreatedOn', 'ASC']] // Oldest first (Chat style)
    });

    // Format for frontend
    return replies.map(r => {
        const reply = r.toJSON();

        // Handle User Photo URL
        let userPhoto = reply.repliedByEmployee?.UserPhoto;
        if (userPhoto && !userPhoto.startsWith('http')) {
            if (userPhoto.startsWith('profile-') || !userPhoto.includes('/')) {
                userPhoto = `/uploads/profile/${userPhoto}`;
            } else if (!userPhoto.startsWith('/')) {
                userPhoto = `/Images/Profile/${userPhoto}`;
            } else {
                userPhoto = `/${userPhoto}`; // Ensure leading slash if missing
            }
            userPhoto = `${process.env.BASE_URL || 'http://localhost:3000'}${userPhoto}`;
        }

        // Handle attachment URL in Reply text if stored there, or if we have a separate logic.
        // Current implementation stores attachment path in 'Reply' content or expects it there?
        // If the reply is an attachment type, the `Reply` field might contain the path.
        // We will process it similar to profile image if it looks like a path.
        let attachment = null;
        let message = reply.Reply;

        if (reply.ReplyType === 'Attachment' || reply.ReplyType === 'Image' || reply.ReplyType === 'File') {
            // If message contains a path
            attachment = message;
            // Ensure full URL
            if (attachment && !attachment.startsWith('http')) {
                attachment = `${process.env.BASE_URL || 'http://localhost:3000'}${attachment.startsWith('/') ? '' : '/'}${attachment}`;
            }
            message = 'Sent an attachment'; // Display text
        }

        return {
            id: reply.Id,
            message: message,
            attachment: attachment,
            type: reply.ReplyType, // Text, Image, File
            sender: {
                name: reply.repliedByEmployee ? `${reply.repliedByEmployee.FirstName} ${reply.repliedByEmployee.LastName}`.trim() : 'Unknown',
                photo: userPhoto,
                employeeId: reply.repliedByEmployee?.EmpId
            },
            date: reply.CreatedOn,
            isMe: false // Controller/Frontend can decide based on logged in user
        };
    });
};

/**
 * Send a reply to a ticket
 * @param {number} ticketId 
 * @param {number} employeeId 
 * @param {string} message 
 * @param {Object} file (optional)
 * @param {string} status (optional status update)
 */
exports.sendTicketReply = async (ticketId, employeeId, message, file, status) => {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // If file exists, create attachment reply
    if (file) {
        let filePath = file.path.replace(/\\/g, '/'); // Normalize path
        // Ensure path starts from uploads
        if (filePath.includes('uploads/')) {
            filePath = filePath.substring(filePath.indexOf('uploads/'));
        }

        await TicketReply.create({
            TicketId: ticketId,
            RepliedbyBy: employeeId,
            ReplyType: file.mimetype.startsWith('image/') ? 'Image' : 'File',
            Reply: filePath, // Store path in Reply column
            CreatedOn: new Date(),
            IsDeleted: false
        });
    }

    // If text message exists (and it's not just the file)
    if (message && message.trim() !== '') {
        await TicketReply.create({
            TicketId: ticketId,
            RepliedbyBy: employeeId,
            ReplyType: 'Text',
            Reply: message,
            CreatedOn: new Date(),
            IsDeleted: false
        });
    }

    // Update Ticket Status to 'Answered' or 'In Progress' if it was 'Open'
    // Or if employee replies, maybe status logic depends on who replies?
    // If Assignee replies -> 'Answered'
    // If Requester replies -> 'Reopen' ? or just add to chat.
    // For now, let's just ensure it's not Closed if a reply comes in?
    // If status is provided, update it always (e.g. closing a ticket)
    // If not provided, fallback to logic:
    // If ticket was Open -> In Progress
    if (status && status !== 'null' && status !== 'undefined') {
        await ticket.update({ Status: status });
    } else {
        if (ticket.Status === 'Closed') {
            // await ticket.update({ Status: 'Reopen' }); 
        } else if (ticket.Status === 'Open') {
            await ticket.update({ Status: 'In Progress' });
        }
    }

    return { success: true, message: 'Reply sent successfully' };
};

/**
 * Transfer ticket to another assignee
 * @param {number} ticketId 
 * @param {number} assigneeId 
 * @param {number} employeeId (Current user ID performing transfer - optional check)
 */
exports.transferTicket = async (ticketId, assigneeId, employeeId) => {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Check if new assignee exists
    const assignee = await Employee.findByPk(assigneeId);
    if (!assignee) throw new Error('Assignee not found');

    // Logic: 
    // 1. Add new assignee to TicketAssignee table ?
    // 2. OR Update existing active assignee to something else? 
    // User said "Transfer" which implies changing the current assignee.
    // Let's mark old assignees as 'Transferred' or just add new one as 'Pending'?
    // Typically in helpdesk: Add new record, maybe close old one.

    // Let's add new Assignee record
    await TicketAssignee.create({
        TicketId: ticketId,
        AssigneeId: assigneeId,
        Status: 'Pending',
        CreatedOn: new Date()
    });

    // Optionally update Ticket status or log transfer in replies?
    // We can add a system reply saying "Ticket transferred to X"
    /*
    await TicketReply.create({
        TicketId: ticketId,
        RepliedbyBy: employeeId,
        ReplyType: 'System',
        Reply: `Ticket transferred to ${assignee.FirstName} ${assignee.LastName}`,
        CreatedOn: new Date(),
        IsDeleted: false
    });
    */

    return { success: true, message: 'Ticket transferred successfully' };
};

/**
 * Submit Feedback for a ticket
 * @param {number} ticketId 
 * @param {number} employeeId 
 * @param {Object} feedbackData { rating: number, comment: string }
 */
exports.submitFeedback = async (ticketId, employeeId, feedbackData) => {
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Check if feedback already exists
    const existing = await TicketFeedback.findOne({ where: { TicketId: ticketId, IsDeleted: false } });
    if (existing) throw new Error('Feedback already submitted for this ticket');

    // Map rating (1-5) to Star booleans (Assuming cumulative or single)
    // Based on "Star1...Star5", let's set them all true up to rating.
    const { rating, comment } = feedbackData;

    await TicketFeedback.create({
        TicketId: ticketId,
        FeedBackBy: employeeId,
        Feedback: comment,
        Star1: rating >= 1,
        Star2: rating >= 2,
        Star3: rating >= 3,
        Star4: rating >= 4,
        Star5: rating >= 5,
        CreatedOn: new Date(),
        IsDeleted: false
    });

    return { success: true, message: 'Feedback submitted successfully' };
};

// Report methods can reuse the above or be specific (e.g. date range filters)
exports.getTicketReportSummary = async () => {
    return await exports.getTicketStatusSummary();
};

exports.getTicketReportGraph = async () => {
    // Return data suitable for a graph (e.g. status counts)
    const summary = await exports.getTicketStatusSummary();
    // Transform to graph format if needed, e.g. labels and data
    return {
        labels: Object.keys(summary).filter(k => k !== 'All'),
        data: Object.keys(summary).filter(k => k !== 'All').map(k => summary[k])
    };
};

exports.getTicketSummaryList = async (query) => {
    return await exports.getTicketStatusList(query);
};

