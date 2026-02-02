const db = require('../../models');
const { Category } = db;
const { Op } = require('sequelize');

exports.getAllCategories = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        IsDeleted: {
            [Op.or]: [
                { [Op.eq]: 0 },
                { [Op.eq]: false },
                { [Op.is]: null },
                { [Op.eq]: '0' },
                { [Op.eq]: 'false' }
            ]
        }
    };

    if (search) {
        whereClause.CategoryName = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    return await Category.findAndCountAll(queryOptions);
};

exports.getCategoryById = async (id) => {
    return await Category.findByPk(id);
};

exports.createCategory = async (data) => {
    return await Category.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
};

exports.updateCategory = async (category, data) => {
    return await category.update(data);
};

exports.deleteCategory = async (category) => {
    return await category.update({ IsDeleted: true });
};
