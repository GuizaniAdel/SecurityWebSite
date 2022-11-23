const express = require('express');
const cors = require('cors');
const connection = require('./config/DatabaseConfig')
var path = require('path');

connection.getConnections();


const app = express();


//integrate react inside express
app.use(express.static(path.resolve(__dirname, 'build')));

//CORS config : limit access
const corsoption = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}
app.use(cors(
    corsoption
));

// Import Routes
const authRoute = require('./routes/auth');
const BlogRoute = require('./routes/Blog');

//MiddleWares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));


// Route MiddleWares
app.use('/api/user', authRoute);
app.use('/api', BlogRoute);

//integrate react inside express
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;

