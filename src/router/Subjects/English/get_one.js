const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");

// api error method
const ApiErrors = require("../../../utils/validation_error/ApiErrors");

// english model
const English = require("../../../models/Subjects Banks/english/english");


router.get("/" , async (req , res , next) => {
    try {

        // create Schema
        const Schema = Joi.object().keys({
            question_id : Joi.string().required(),
        });

        // validate query data
        const Error = Schema.validate(req.query);

        // check if the query data has any error
        if (Error.error) {
            // return error
            return next(new ApiErrors(JSON.stringify({
                english : Error.error.details[0].message,
                arabic : "... عذرا خطأ في البيانات المرسلة"
            }) , 400));
        }

        // find the question
        const question = await English.findById(req.query.question_id).populate({
            path : "created_by",
            select : "_id name avatar"
        });

        // check if the question is exists
        if (!question) {
            // return error
            return next(new ApiErrors(JSON.stringify({
                english : "Sorry, question not found ...",
                arabic : "... عذرا لم يتم العثور السؤال"
            }) , 404));
        }

        // create result
        const result = {
            "message" : "Question deted successfully",
            "question_data" : _.pick(question , ["_id" , "title" , "description" , "note" , "points" , "level" , "images" , "repated" , "options" , "created_by"])
        }

        // send the resul
        res.status(200).send(result);

    } catch (error) {
        // return error
        return next(new ApiErrors(JSON.stringify({
            english : `${error}...`,
            arabic : "... عذرا خطأ عام"
        }) , 500));
    }
});

module.exports = router;