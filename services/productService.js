const db = require('../models');
const { Product } = db;
const fs = require('fs');
const { Op } = require('sequelize');

const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

exports.transformProduct = (product) => {
    if (!product) return null;
    const json = product.toJSON ? product.toJSON() : product;
    if (json.UserPhoto && !json.UserPhoto.startsWith('http')) {
        json.UserPhoto = `${baseUrl}${json.UserPhoto}`;
    }
    return json;
};

/**
 * Get all products
 * @returns {Promise<Array>} List of products
 */
exports.getAllProducts = async () => {
    const products = await Product.findAll({
        where: {
            [Op.or]: [
                { IsDeleted: false },
                { IsDeleted: null },
                { IsDeleted: 0 }
            ]
        },
        order: [['CreatedOn', 'DESC']]
    });
    return products.map(exports.transformProduct);
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
    const product = await Product.create({
        ...data,
        CreatedOn: new Date(),
        IsDeleted: false
    });
    return exports.transformProduct(product);
};

/**
 * Update product
 * @param {Object} product - Product instance
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated product
 */
exports.updateProduct = async (product, data) => {
    // Handle file replacement
    if (data.UserPhoto && product.UserPhoto && data.UserPhoto !== product.UserPhoto) {
        if (fs.existsSync(product.UserPhoto.replace('/', ''))) {
            try {
                fs.unlinkSync(product.UserPhoto.replace('/', ''));
            } catch (e) { console.error('Error deleting old product photo', e); }
        }
    }
    const updatedProduct = await product.update(data);
    return exports.transformProduct(updatedProduct);
};

/**
 * Delete product (soft delete)
 * @param {Object} product - Product instance
 * @returns {Promise<Object>} Deleted product
 */
exports.deleteProduct = async (product) => {
    return await product.update({ IsDeleted: true });
};
