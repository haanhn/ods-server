const categoryService = require('../services/categoriesService');

exports.getOpenCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.findCategoriesByStatus();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}