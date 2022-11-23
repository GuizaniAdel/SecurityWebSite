const nodemailer = require('nodemailer');
const User = require('../models/User');
const hbs = require('nodemailer-express-handlebars');


const ResetPassword = async (req, res) => {

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
        return res.status(400).send("user doesnt exist please verify your email");
    }

    // generate token for account activation
    const rand = Math.random().toString(36).substr(2);
    const rand2 = Math.random().toString(36).substr(2);
    const rand3 = Math.random().toString(36).substr(2);
    const resetToken = rand + rand2 + rand3;

    const updateusertoken = await User.updateOne(
        { email: req.params.email },
        { resetToken: resetToken },
    )

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });


    mailTransporter.use('compile', hbs({
        viewEngine: {
            extname: '.handlebars',
            layoutsDir: './src/views/',
            defaultLayout: 'index',
        },
        viewPath: './src/views'
    }))

    let mailDetails = {
        from: 'Securinets Esprit',
        to: req.params.email,
        subject: 'Reset Password',
        template: 'index',
        context: {
            username: user.username,
            resetToken: resetToken,
        }
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            res.status(400).json({ "error": err });
        } else {
            res.status(200).json({ "success": 'Email sent successfully' });
        }
    });

};

module.exports = ResetPassword;


