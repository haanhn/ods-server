const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config();


const app = express();

// import routes
// const adminRoutes = require('./routes/api/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

// app.use('/', (req, res, next) => {
//     res.send('api running');
// });

// app.use('/admin', adminRoutes);

app.use((req, res, next) => {
    res.status(404).send('page not found');
});

//Models
const models = require("./models");




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