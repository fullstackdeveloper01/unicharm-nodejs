const db = require('../../models');
const { Product } = db;
const fs = require('fs');
const { Op } = require('sequelize');



/**
 * Get all products
 * @returns {Promise<Array>} List of products
 */
exports.getAllProducts = async (page = 1, limit = null, search = '') => {
    const pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit);
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = null;

    const whereClause = {
        [Op.or]: [
            { IsDeleted: false },
            { IsDeleted: null },
            { IsDeleted: 0 }
        ]
    };

    if (search) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({ Name: { [Op.like]: `%${search}%` } });
    }

    const queryOptions = {
        where: whereClause,
        order: [['CreatedOn', 'DESC']]
    };

    if (limitNumber) {
        queryOptions.limit = limitNumber;
        queryOptions.offset = (pageNumber - 1) * limitNumber;
    }

    const { count, rows } = await Product.findAndCountAll(queryOptions);
    return { count, rows };
};

/**
 * Get product by ID (Returns Sequelize Instance)
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Product Instance
 */
exports.getProductById = async (id) => {
    return await Product.findByPk(id);
};

/**
 * Create product
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Created product
 */
exports.createProduct = async (data) => {
    const existing = await Product.findOne({
        where: {
            Name: data.Name,
            IsDeleted: { [Op.or]: [false, 0, null] }
        }
    });

    if (existing) {
        throw new Error('Product with this name already exists');
    }

    const product = await Product.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
    return product;
};

/**
 * Update product
 * @param {Object} product - Product instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated product
 */
exports.updateProduct = async (product, data) => {
    if (data.Name && data.Name !== product.Name) {
        const existing = await Product.findOne({
            where: {
                Name: data.Name,
                IsDeleted: { [Op.or]: [false, 0, null] },
                Id: { [Op.ne]: product.Id }
            }
        });

        if (existing) {
            throw new Error('Product with this name already exists');
        }
    }
    // Handle file replacement
    if (data.UserPhoto && product.UserPhoto && data.UserPhoto !== product.UserPhoto) {
        if (fs.existsSync(product.UserPhoto.replace('/', ''))) {
            try {
                fs.unlinkSync(product.UserPhoto.replace('/', ''));
            } catch (e) { console.error('Error deleting old product photo', e); }
        }
    }
    const updatedProduct = await product.update(data);
    return updatedProduct;
};

/**
 * Delete product (soft delete)
 * @param {Object} product - Product instance
 * @returns {Promise<Object>} Deleted product
 */
exports.deleteProduct = async (product) => {
    return await product.update({ IsDeleted: true });
};
