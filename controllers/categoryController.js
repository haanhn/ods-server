const slug = require('slug');
const Category = require('../models').Category;
const Campaign = require('../models').Campaign;
const Swal = require('sweetalert2');

exports.index = async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.render('categories/index', {
            pageTitle: 'Admin - Categories',
            path: '/admin/categories',
            categories: categories,
            message: ''
        });
    } catch (error) {
        console.log(error);
    }
};

exports.create = (req, res, next) => {
    res.render('categories/create', {
        pageTitle: 'Admin - Create Categories ',
        path: '/admin/categories',
        message: ''
    })
};

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
            // req.flash('success', 'Category được tạo thành công.');
            res.redirect('/admin/categories');
            // res.send(Swal.fire('sadsdsa'));
            
        } else {
            // req.flash('error', 'Category đã tồn tại.');
            res.render('categories/create', {
                pageTitle: 'Admin - Create Categories ',
                path: '/admin/categories',
                message : 'error'
            })
           
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
};

exports.update = async (req, res, next) => {
    const categoryId = req.body.categoryId;
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
        let category = await Category.findOne({ where: { id: categoryId } });
        let checked = await Category.findOne({ where: { categorySlug: categorySlug}});
        if(checked){
        if(checked.categorySlug == category.categorySlug){
            checked = null;
        }
    }
        // console.log(checked);
        if (category != null) {
            if(checked === null){
                category = await Category.update({
                    categoryTitle: categoryTitle,
                    categorySlug: categorySlug,
                    categoryIcon: categoryIcon,
                    status: status
                        },{
                            where: {
                               id : categoryId
                            }
                        });     
            req.flash('success', 'Category được cập nhật thành công.');
            res.redirect('/admin/categories');
            }else{
                res.redirect('/admin/categories');
                
            }       
        } else {
            req.flash('error', 'Category existed.');
            res.redirect('/admin/categories');
        } 
    } catch (error) {
        console.log(error);
    }
};
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

exports.delete = async(req, res, next) => {
    const categoryId = req.params.id;
    try{
        //let category =  await Category.findByPk(categoryId);
        let category =  await Category.findOne({
            where: {
                id : categoryId
            },
            include:[Campaign]
        });
        let check = category.Campaigns.length;
        if (category != null) {
            if(check == 0){
            category.destroy(); 
            req.flash('success', 'Catogory được xóa thành công.');
            res.redirect('/admin/categories');  
            }
            else{
                try {
                    const categories = await Category.findAll();
                    res.render('categories/index', {
                        pageTitle: 'Admin - Categories',
                        path: '/admin/categories',
                        categories: categories,
                        message: 'error'
                    });
                } catch (error) {
                    console.log(error);
                }
            }     
        } else {
            req.flash('error', 'Role existed.');
            res.redirect('/admin/categories');
        }
    }catch(err){
        console.log(err);
    }
    // Category.findAll({
    //     where: {
    //         id : categoryId
    //     },include:{
    //         model : models.Campaign,
    //         as: 'campaign'
    //      }
    // })
    //     .then(category => {
    //         if (!category) {
    //             const error = new Error('Could not find category.');
    //             error.statusCode = 404;
    //             throw error;
    //             res.redirect('/admin/categories');
    //         }else{
    //             return category.destroy();
    //             res.redirect('/admin/categories');
    //         }                   
    //     })
    //     .then(result => {
    //         res.status(200).json({
    //             message: 'Category deleted'
    //         });
    //     })
    //     .catch(err => { 
    //         if (!err.statusCode) {
    //             err.statusCode = 500;
    //         }
    //         next(err);
    //     });
}