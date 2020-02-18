const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');


const app = express();

// import routes
const adminRoutes = require('./routes/api/admin');

//import model
const models = require("./models");

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
        db: models.sequelize
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isLoggedIn;
//     next();
// });



// app.use('/', (req, res, next) => {
//     res.send('api running');
//     // next();
// });

app.use('/admin', adminRoutes);

app.use((req, res, next) => {
    res.status(404).send('page not found');
});


//Sync Database
models.sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        console.log('Nice! Database looks fine')
    })
    .catch(err => {
        console.log(err, "Something went wrong with the Database Update!")
    });

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});