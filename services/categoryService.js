const db = require('../models');
const { Category } = db;

exports.getAllCategories = async () => {
    const categories = await Category.findAll({ where: { IsDeleted: false } });
    return categories.map(cat => ({
        ...cat.toJSON(),
        CategoryDescription: cat.Description
    }));
};
exports.getCategoryById = async (id) => Category.findByPk(id);
exports.createCategory = async (data) => Category.create({ ...data, CreatedOn: new Date(), IsDeleted: false });
exports.updateCategory = async (item, data) => item.update(data);
exports.deleteCategory = async (item) => item.update({ IsDeleted: true });
