const bcrypt = require('bcryptjs');
const slug = require('slug');

const seedRoles = [
    {
        roleName: 'admin'
    },
    {
        roleName: 'user'
    },
    {
        roleName: 'guest'
    }
];
const seedUsers = [
    {
        email: 'adminods@gmail.com',
        password: bcrypt.hashSync('adminods', 10),
        fullname: 'Lưu Văn Tịnh'
    },
    {
        email: 'haanhx701@gmail.com',
        password: bcrypt.hashSync('12345678', 10),
        fullname: 'Nguyễn Thị Hà Anh'
    },
    {
        email: 'thatntnntha1997@gmail.com',
        password: bcrypt.hashSync('12345678', 10),
        fullname: 'Nguyễn Thị Hà Anh 2'
    },
    {
        email: 'honghax701@gmail.com',
        password: bcrypt.hashSync('12345678', 10),
        fullname: 'Lưu Thị Hồng Hà'
    },
    {
        email: 'huutamx701@gmail.com',
        password: bcrypt.hashSync('12345678', 10),
        fullname: 'Nguyễn Hữu Tâm'
    }
];
const seedCategories = [
    // {
    //     categoryTitle: 'Mới nhất',
    //     categorySlug: slug('Mới nhất').toLocaleLowerCase()
    // },
    // {
    //     categoryTitle: 'Nổi bật',
    //     categorySlug: slug('Nổi bật').toLocaleLowerCase()
    // },
    {
        categoryTitle: 'Giáo dục',
        categorySlug: slug('Giáo dục').toLocaleLowerCase()
    },
    {
        categoryTitle: 'Cộng đồng',
        categorySlug: slug('Cộng đồng').toLocaleLowerCase()
    },
    {
        categoryTitle: 'Gia đình',
        categorySlug: slug('Gia đình').toLocaleLowerCase()
    },
    {
        categoryTitle: 'Thiên nhiên',
        categorySlug: slug('Thiên nhiên').toLocaleLowerCase()
    },
    {
        categoryTitle: 'Cứu trợ thiên tai',
        categorySlug: slug('Cứu trợ thiên tai').toLocaleLowerCase()
    }
    // 'Mới nhất', 'Nổi bật', 'Giáo dục', 'Dự án sáng tạo', 'Cộng đồng', 'Gia đình', 'Thiên nhiên',
    // 'Cứu trợ thiên tai', 'Y tế', 'Khác']

];
const campaign = {
    campaignTitle: 'Quyên góp cứu trợ thiên tai miền Trung',
    campaignSlug: slug('Quyên góp cứu trợ thiên tai miền Trung')
};

module.exports = { seedRoles, seedUsers, seedCategories };