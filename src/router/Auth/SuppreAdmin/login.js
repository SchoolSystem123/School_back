const express = require("express");
const router = express.Router();
const _ = require("lodash");

// admin model
const Admin = require("../../../models/Admin/admin");

// validate body data 
const ApiErrors = require("../../../utils/validation_error/ApiErrors");

// compare password
const comparePassword = require("../../../utils/password_methods/Compaer_Password");

// valiadte log inbody data
const Validate_super_admin_login = require("../../../middleware/joi_validation/super_Admin/login");

// generate token method
const GenerateToken = require("../../../utils/token_methods/GenerateToken");

router.post("/" , async (req , res , next) => {
    try {
        
        // validate body data
        const Error = Validate_super_admin_login(req.body);

        // check if the body data has any error
        if (Error.error) {
            return next(new ApiErrors(JSON.stringify({
                english : Error.error.details[0].message,
                arabic : "... عذرا خطأ في البيانات المرسلة"
            }) , 400));
        }

        // find the super admin
        const superAdmin = await Admin.findOne({ email : req.body.super_admin_email });

        // check if the super admin is exists
        if (!superAdmin) {
            return next(new ApiErrors(JSON.stringify({
                english : "Invalid email or password ...",
                arabic : "... عذرا خطأ في الايميل او كلمة المرور "
            }) , 404));
        }

        // compare passwords
        const comparedPassword = await comparePassword(req.body.super_admin_password , superAdmin.password);

        // check if the password is true or not
        if (!comparedPassword) {
            return next(new ApiErrors(JSON.stringify({
                english : "Invalid email or password ...",
                arabic : "... عذرا خطأ في الايميل او كلمة المرور "
            }) , 400));
        }

        // generate token
        const token = GenerateToken(superAdmin._id , superAdmin.email);

        // create result
        const result = {
            "message" : "loged in successfully",
            "admin_data" : _.pick(superAdmin , ["_id" , "name" , "is_admin" , "email" , "avatar" , "gender" , "joinde_at"]),
            "token" : token
        };

        // send the result to the user
        res.status(200).send(result);

    } catch (error) {
        return next(new ApiErrors(JSON.stringify({
            english : error,
            arabic : "... عذرا خطأ عام"
        }) , 500));
    }
});

module.exports = router;