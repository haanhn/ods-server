const slug = require('slug');

const Category = require('../models').Category;
const { findCategoriesByStatus } = require('../services/categoriesService');

exports.index = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.render('categories/index', {
            pageTitle: 'Admin - Categories',
            path: '/admin/categories',
            categories: categories
        });
    } catch (error) {
        console.log(error);
    }
};

exports.create = (req, res, next) => {
    res.render('categories/create', {
        pageTitle: 'Admin - Create Categories ',
        path: '/admin/categories'
    })
}

exports.store = async (req, res, next) => {
    const categoryTitle = req.body.categoryTitle;
    const categoryIcon = req.body.categoryIcon;
    const categorySlug = slug(categoryTitle);
    let status = req.body.status;
    if (!status) {
        status = 'disable';
    } else {
        status = 'enable';
    }
    
    try {
        let category = await Category.findOne({ where: { categorySlug: categorySlug } });
        if (!category) {
            category = await Category.create({
                            categoryTitle: categoryTitle,
                            categorySlug: categorySlug,
                            categoryIcon: categoryIcon,
                            status: status
                        });
            req.flash('success', 'Category được tạo thành công.');
            res.redirect('/admin/categories');
        } else {
            req.flash('error', 'Category đã tồn tại.');
            res.redirect('/admin/categories');
        }
    } catch (error) {
        console.log(error);
    }
};

exports.edit = async (req, res, next) => {
    const slug = req.params.categorySlug;
    try {
        const category = await Category.findOne({ where: { categorySlug: slug } });
        if (!category) {
            req.flash('error', 'Category không tồn tại.');
            res.redirect('/admin/categories');
        } else {
            res.render('categories/edit', {
                pageTitle: 'Admin - Edit Categories ',
                path: '/admin/categories',
                category: category
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.update = (req, res, next) => {
    const categoryId = req.body.categoryId;
    const categoryTitle = req.body.categoryTitle;
    const categoryIcon = req.body.categoryIcon;
    const categorySlug = slug(categoryTitle);
    let status = req.body.status;
    if (!status) {
        status = 'disable';
    }

    // Category.findByPk(categoryId)
    //     .then(category => {
    //         if (!category) {
    //             req.flash('error', 'Category không tồn tại.');
    //             res.redirect('/admin/categories');
    //         }
    //         category.categoryTitle = categoryTitle;
    //         category.categoryIcon = categoryIcon;
    //         category.categorySlug = categorySlug;
    //         category.status = status;
    //         return category.save();
    //     })
    //     //todo check duplicate before update
    //     .then(result => {
    //         req.flash('success', 'Category được update thành công.');
    //         res.redirect('/admin/categories');
    //     })
    //     .catch(err => console.log(err));
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

exports.getOpenCategories = async (req, res, next) => {
    try {
        const categories = await findCategoriesByStatus();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
}