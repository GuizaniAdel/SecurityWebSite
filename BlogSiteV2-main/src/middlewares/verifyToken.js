const jwt = require('jsonwebtoken');
const User = require('../models/User');

//check if user has a token after loggin in 
const verifyTokenMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access Denied');
    }
    const token = authHeader.split(' ')[1];
    try {
        // retrieve id and username of the user embedded inside the jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username, id } = decoded
        const user = await User.findOne({ _id: id, username: username });
        if (user) {
            req.user = { username, id };
            next();
        }
        else {
            res.status(400).send('invalid Token from our database');
        }
    } catch (error) {
        res.status(400).send('invalid Token');
    }
}

module.exports = verifyTokenMiddleware
