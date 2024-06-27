const Joi = require("joi");

const Validate_teacher_update = (data) => {
    // create Schema to validate body data using it
    const Schema = Joi.object().keys({
        spuer_admin_id : Joi.string().required(),
        teacher_id : Joi.string().required(),
        name : Joi.string().min(3).max(100),
        editor : Joi.boolean(),
        subject : Joi.string(),
        email : Joi.string().min(5).max(50).email(),
        password : Joi.string().min(8).max(100),
        about_me : Joi.string().min(10).max(500),
        gender : Joi.string(),
        delete_avatar : Joi.boolean(),
        class_level : Joi.string(),
        phone_number : Joi.number().min(10).max(10),
    });

    // validate body data using Schema
    const Error = Schema.validate(data);

    // return the error to use in router file
    if (Error.error) {
        return Error
    } else {
        return true
    }
};

module.exports = Validate_teacher_update;