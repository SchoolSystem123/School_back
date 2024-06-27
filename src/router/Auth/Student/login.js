const express = require("express");
const router = express.Router();
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config({ path : "../../../../config/.env" });

// api error
const ApiErrors = require("../../../utils/validation_error/ApiErrors");

// student model
const Student = require("../../../models/Student/student");

// validate body data method
const Validate_student_login = require("../../../middleware/joi_validation/Student/Joi_validate_login");

// comapre password's
const compare = require("../../../utils/password_methods/Compaer_Password");

// generate token method
const GenerateToken = require("../../../utils/token_methods/GenerateToken");

router.post("/" , async (req , res , next) => {
    try {

        // validate body data 
        const Error = Validate_student_login(req.body);

        // check if the bod data has any error
        if (Error.error) {
            // return error
            return next(new ApiErrors(JSON.stringify({
                english : Error.error.details[0].message,
                arabic : "... عذرا خطأ في البيانات المرسلة"
            }) , 400));
        }

        // find the student 
        const student = await Student.findOne({ email : req.body.email });

        // check if the student is exists
        if (!student) {
            // return error
            return next(new ApiErrors(JSON.stringify({
                english : "Sorry, invalid email or password ..." ,
                arabic : "... عذرا خطأ في الايميل او كلمة المرور"
            }), 404));
        };

        const Compare_password = await compare(req.body.password , student.password);

        // check if the password 
        if (!Compare_password) {
            // return error
            return next(new ApiErrors(JSON.stringify({
                english : "Sorry, invalid email or password ..." ,
                arabic : "... عذرا خطأ في الايميل او كلمة المرور"
            }) , 404));
        }

        // create token 
        const token = GenerateToken(student._id , student.email);

        // craete result
        const result = {
            "message" : "Loed in successfully",
            "student_data" : _.pick(student , ["_id" , "name" , "avatar" , "email" , "about_me" , "phone_number" , "gender" , "finished_exams" , "points" , "classes" , "plans" , "class_level" , "joind_at"]),
            "token" : token
        };

        // send the result 
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(JSON.stringify({
            english : error,
            arabic : "... عذرا خطأ عام"
        }) , 500));
    }
});

module.exports = router;