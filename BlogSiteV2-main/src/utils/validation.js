
//Validation
const Joi = require('@hapi/joi');

//Register validation functions
const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        team: Joi.string().required(),
        password: Joi.string().required(),
        username: Joi.string().required()
    });
    return schema.validate(data);
};


//Register validation functions
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

//Blog validation functions
const BlogValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        category: Joi.string().required(),
        description: Joi.string().required(),
        blogcontent: Joi.string().required(),
        flag: Joi.string().required(),
        team: Joi.string().required(),

    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.BlogValidation = BlogValidation;
