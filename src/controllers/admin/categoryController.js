const slug = require('slug');

const Category = require('../../models').Category;
const { findCategoriesByStatus } = require('../../services/categoriesService');

exports.index = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.render('categories/index', {
      pageTitle: 'Admin - Categories',
      path: '/admin/categories',
      categories: categories,
      admin: req.user
    });
  } catch (error) {
    console.log(error);
  }
};

exports.create = (req, res, next) => {
  res.render('categories/create', {
    pageTitle: 'Admin - Create Categories ',
    path: '/admin/categories', 
    admin: req.user
  });
};

exports.store = async (req, res, next) => {
  const categoryTitle = req.body.categoryTitle;
  const categorySlug = slug(categoryTitle);
  let status = req.body.status;
  if (!status) {
    status = 'disable';
  } else {
    status = 'enable';
  }

  try {
    let category = await Category.findOne({
      where: { categorySlug: categorySlug }
    });
    if (!category) {
      category = await Category.create({
        categoryTitle: categoryTitle,
        categorySlug: categorySlug,
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
        admin: req.user,
        category: category
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res, next) => {
  const reqSlug = req.params.categorySlug;
  const categoryId = req.body.categoryId;
  const categoryTitle = req.body.categoryTitle;
  const categorySlug = slug(categoryTitle);
  let status = req.body.status;
  if (!status) {
    status = 'disable';
  } else {
    status = 'enable';
  }
  const category = await Category.findOne({
    where: {
      categorySlug: reqSlug
    }
  });
  if (!category) {
    req.flash('error', 'Category không tồn tại.');
    res.redirect('/admin/categories/edit/' + reqSlug);
  } else {
    category.categoryTitle = categoryTitle;
    category.categorySlug = categorySlug;
    category.status = status;
    await category.save();
    req.flash('success', 'Category update thành công.');
    res.redirect('/admin/categories');
  }
};

exports.delete = async (req, res, next) => {
  const categorySlug = req.params.categorySlug;
  console.log(categorySlug);
  const category = await Category.findOne({
    where: {
      categorySlug: categorySlug
    }
  });

  if(!category) {
    req.flash('error', 'Category không tồn tại.');
    res.redirect('/admin/categories');
  } else {
    await category.destroy();
    req.flash('success', 'Category được xóa thành công.');
    res.redirect('/admin/categories');
  }
};