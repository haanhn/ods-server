const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');
const logger = require('morgan');
const cors = require('cors');
const expressValidator = require('express-validator');

const app = express();

// import routes
const adminRoutes = require('./routes/admin/admin');
const api = require('./routes/api/api');

//import model
const models = require('./models');

//import seed datas
const { seedRoles, seedUsers, seedCategories } = require('./seedDatas');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
      db: models.sequelize
    }),
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use(logger('dev'));
app.use(expressValidator());

app.use(cors());
// app.use('/',(req, res, next) => {
//     res.send('API RUNNING');
//     next();
// });
app.use('/admin', adminRoutes);
app.use('/api', api);

app.use((req, res, next) => {
    res.status(404).json({ success: 'false', message: 'Page not found'});
});

//Sync Database
models.sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        console.log('Nice! Database looks fine');
    })
    .catch(err => {
        console.log(err, "Something went wrong with the Database Update!")
    });

app.listen(5000, () => {
  console.log('App listening on port 5000!');
});
