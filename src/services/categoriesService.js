const Category = require('../models').Category;

exports.findCategoriesByStatus = async (status) => {
    const statusValue =  status ? status : 'enable';
    return await Category.findAll({ where: { status: statusValue } });
}

exports.findCategoryBySlug = async (slug) => {
    return await Category.findOne({ where: { categorySlug: slug } });
}