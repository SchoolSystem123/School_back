const Joi = require("joi");

const Validate_update_question = (data) => {
    // create Schema to validate body data using it
    const Schema = Joi.object().keys({
        admin_id : Joi.string().required(),
        question_id : Joi.string().required(),
        title : Joi.string().min(3).max(300),
        description : Joi.string().min(3).max(300),
        note : Joi.string().min(5).max(100),
        points : Joi.number(),
        level : Joi.string(),
        class_level : Joi.string(),
        repated : Joi.array(),
        options : Joi.array(),
        images_for_delete : Joi.array()
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

module.exports = Validate_update_question;