const slug = require('slug');

const Category = require('../models').Category;

exports.index = (req, res, next) => {
    Category.findAll()
    .then(categories => {
        if (categories.length === 0) {
            res.status(404).json({
                message: 'No have category.',
                categories: null,
            })    
        } else {
            res.status(200).json({
                message: 'Fetched categories successfully.',
                categories: categories,
            })
        }
    })
    .catch(err => { 
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.store = (req, res, next) => {
    const categoryTitle = req.body.categoryTitle;
    const categoryIcon = req.body.categoryIcon;
    const categorySlug = slug(categoryTitle);
    Category.findOne({ where: { categorySlug: categorySlug } })
    .then(category => {
        if (category) {
            const error = new Error('Category has been already exist in DB.');
            error.statusCode = 409;
            throw error;
        }
        return Category.create({
            categoryTitle: categoryTitle,
            categorySlug: categorySlug,
            categoryIcon: categoryIcon
        })
    })
    .then(category => {
        res.status(201).json({
            message: 'Category created successfully!',
            category: category
        })
    })
    .catch(err => { 
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.findByPk(categoryId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Category fetched',
                category: category
            });
        })
        .catch(err => { 
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.update = (req, res, next) => {
    const categoryId = req.body.categoryId;
    const categoryTitle = req.body.categoryTitle;
    const categoryIcon = req.body.categoryIcon;
    const categorySlug = slug(categoryTitle);

    Category.findByPk(categoryId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            category.categoryTitle = categoryTitle;
            category.categoryIcon = categoryIcon;
            category.categorySlug = categorySlug
            return category.save();
        })
        //todo check duplicate before update
        .then(result => {
            res.status(200).json({
                message: 'Category updated',
                category: result
            });
        })
        .catch(err => { 
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.delete = (req, res, next) => {
    const categoryId = req.body.categoryId;
    Category.findByPk(categoryId)
        .then(category => {
            if (!category) {
                const error = new Error('Could not find category.');
                error.statusCode = 404;
                throw error;
            }
            return category.destroy();
        })
        .then(result => {
            res.status(200).json({
                message: 'Category deleted'
            });
        })
        .catch(err => { 
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}