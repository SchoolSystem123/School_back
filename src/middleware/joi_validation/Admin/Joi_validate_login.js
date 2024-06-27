const Joi = require("joi");

const Validate_admin_login = (data , next) => {
    // create Schema to validate body data using it
    const Schema = Joi.object().keys({
        email : Joi.string().required().min(5).max(50).email(),
        password : Joi.string().min(8).max(100).required()
    });

    // validate data
    const Error = Schema.validate(data);

    // return the error
    if (Error.error) {
        return Error
    } else {
        return true
    }
};

module.exports = Validate_admin_login;