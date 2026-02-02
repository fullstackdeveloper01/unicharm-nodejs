const db = require('../models');
const { Category } = db;

exports.getAllCategories = async (page = 1, limit = null) => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const queryOptions = {
        where: { IsDeleted: false }
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const { count, rows } = await Category.findAndCountAll(queryOptions);
    const mappedRows = rows.map(cat => ({
        ...cat.toJSON(),
        CategoryDescription: cat.Description
    }));
    return { count, rows: mappedRows };
};
exports.getCategoryById = async (id) => Category.findByPk(id);
exports.createCategory = async (data) => Category.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateCategory = async (item, data) => item.update(data);
exports.deleteCategory = async (item) => item.update({ IsDeleted: true });
