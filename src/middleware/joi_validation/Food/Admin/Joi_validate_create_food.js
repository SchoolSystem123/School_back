const Joi = require("joi");

const Validate_create_food = (data) => {
    // create Schema to validate body data using it
    const Schema = Joi.object().keys({
        admin_id : Joi.string().required(),
        title : Joi.string().min(3).max(100).required(),
        description : Joi.string().min(3).max(500).required(),
        images : Joi.array()
    });

    // validate body data 
    const Error = Schema.validate(data);

    // check if the body data has any error
    if (Error.error) {
        return Error
    } else {
        return true
    }
};

module.exports = Validate_create_food;