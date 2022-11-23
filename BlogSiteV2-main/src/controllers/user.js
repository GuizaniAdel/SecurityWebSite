const router = require('express').Router(); // import express routers
const User = require('../models/User'); // import our user model
const Blog = require('../models/Blog'); // import our user model

const jwt = require('jsonwebtoken'); // used to create jwt
const bcrypt = require('bcryptjs'); // used to hash and unhash password to register and login
const { registerValidation, loginValidation } = require('../utils/validation'); // import our constraints on user 

const register = async (req, res) => {

    //validate data req.body
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    //check if user exist in the databse
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(200).send({ success: false, error: "user already exist" });
    }

    // hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        email: req.body.email,
        password: hashPassword,
        username: req.body.username,
        team: req.body.team,
        score: 0,
    });
    try {
        const savedUser = await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, error: "Please Try Again" });
    }
};


const login = async (req, res) => {

    //validate data req.body
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }

    //check if user exit in the databse
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ error: "user doesnt exist" });
    }

    //check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status('400').send({ error: "invalid password" });
    }

    // create jwt for our user
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    //return the json in the header and the body
    res.header('auth-token', token).status(200).json({ token: token, username: user.username, id: user._id, team: user.team });
};

const updateScore = async (req, res) => {

    const CountBlogsTeams = await Blog.find({ team: req.body.team }).count();
    if (CountBlogsTeams) {


        return res.status(200).json({ TeamScore: CountBlogsTeams * 100 })
    }
    res.status(200).json({ TeamScore: 0 });

};

const getUsersAndScores = async (req, res) => {

    // get all users from our database
    const blogs = await Blog.find();
    var jsonArr = [];

    // mapping all users to retrieve only the username and score {{ for admins }}
    blogs.map((blog) => {
        jsonArr.push({
            title: blog.title,
            team: blog.team
        });
    })


    /*  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
     let i = countOccurrences(jsonArr, "RiceGang");
     console.log(i) */

    // return the json with the usernames and scores
    res.status(200).send(jsonArr);
};

const checkPasswordResetTokenExist = async (req, res) => {

    // retrieve user with resetToken to check if he/she exists to reset password
    const user = await User.findOne({ resetToken: req.params.resetToken });
    if (!user) {
        return res.status(200).json({ error: "user doesnt exist" });
    }
    res.status(200).json({ success: "user exists" });
};

const UpdatePasswordResetuser = async (req, res) => {

    // once the user and token exist , retrieve again to update password 
    const user = await User.findOne({ resetToken: req.body.resetToken });
    if (!user) {
        return res.status(400).json({ error: "user doesnt exist" });
    }

    // hashing reset Password 
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //updating user password 
    const Updateuser = await User.updateOne(
        { resetToken: req.body.resetToken },
        {
            resetToken: null,
            password: hashPassword
        },
    )
    res.status(200).json({ success: true });
};

const deleteUser = async (req, res) => {

    const user = await User.findByIdAndRemove({ _id: req.body.id })

    if (user) {
        return res.status(200).json({ success: "User Deleted !" });
    }

    res.status(400).json({ error: "Access denied" });
};

// export our functions to b use in app.js
module.exports = {
    register,
    login,
    updateScore,
    getUsersAndScores,
    checkPasswordResetTokenExist,
    UpdatePasswordResetuser,
};