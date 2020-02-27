const Category = require('../models').Category;

const findCategoriesByStatus = async (status) => {
    const statusValue =  status ? status : 'enable';
    return await Category.findAll({ where: { status: statusValue } });
}

module.exports = { findCategoriesByStatus }