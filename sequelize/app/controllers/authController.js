require('dotenv').config();
const router = require('express').Router()
const { swagger } = require('../config/swagger/swagger');
const { register, login,registerUser } = require('../services/AuthService');
const { response } = require('../utilities/responseStructure');
const { resetPasswordLink }=require('../services/PasswordService')
/**
 * in swagger default mathod is post, if you are using other then post please add `method: "GET|PUT|PATCH|DELETE"`
 * Default feild type is `string` to use this add `"type": "string|number|integer|password|date|date-time|boolean|array|object"`
 * Default feild in `formData` to use this add `"in": "formData|path|query"`
 * To make the current field mendatery use `"required": true`
 * so, a field(parameter) will be { name: "firstName", "type": "string", "in": "formData", "required": true }
 */

swagger({
    api: "/auth/register",
    summary: "To Perform Sign Up For a User",
    tags: "AUTH",
    fields: [
        "roleId",
        "firstName",
        "lastName",
        "email",
        "phone",
        "password"
    ]
});

router.post('/register', (req, res) => {
    try {
        console.log(req.body);
        register(req.body, (error, result) => {
            response(req, error, result, null,(rs) => {
                console.log("Hello",error);

                res.status(rs.status).json(rs.json);
            });  
            // if (error) {
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // } else {
            //     // console.log(result);                
            //     res.status(200).json({ message: result })
            // }
        });
    } catch (error) {
        res.status(400).json(error);
    }
});


swagger({
    api: "/auth/admin/register",
    summary: "To Perform Sign Up For a User by admin",
    tags: "AUTH",
    fields: [
        "roleId",
        "firstName",
        "lastName",
        "email",
        "phone",
        "password"
    ]
});

router.post('/admin/register',async (req, res) => {
    try {
        console.log(req.body);
        // req.body.password=passwordGenerator();
        registerUser(req.body,async (error, result) => {
            if (error) {
                console.log(error);                
                res.status(400).json({ error: error });
            } else {
                console.log(result);                
                res.status(200).json({ message: result })
            }
        });
    } catch (error) {
        res.status(400).json(error);
    }
});


swagger({
    api: "/auth/login",
    summary: "To Perform Login For a User",
    tags: "AUTH",
    parameters: ["email", "password"]
});
router.post('/login', (req, res) => {
    try {
        let data = {
            email: req.body.email,
            password: req.body.password
        }
        login(data, (error, result) => {
            response(req, error, result, null,(rs) => {
                console.log("Hello",error);

                res.status(rs.status).json(rs.json);
            });   
            // if (error) {
            //     console.log(error);                
            //     res.status(400).json({ message: error });
            // } else {
            //     console.log(result);                
            //     res.status(200).json(result)
            // }
        });
    } catch (error) {
        res.status(400).json(error);
    }

});

module.exports = router;