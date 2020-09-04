require('dotenv').config();
const router = require('express').Router()
const { swagger } = require('../config/swagger/swagger');
// const { register, login } = require('../services/AuthService');
const { resetPassword } = require('../services/PasswordService');
const { response } = require('../utilities/responseStructure');
/**
 * in swagger default mathod is post, if you are using other then post please add `method: "GET|PUT|PATCH|DELETE"`
 * Default feild type is `string` to use this add `"type": "string|number|integer|password|date|date-time|boolean|array|object"`
 * Default feild in `formData` to use this add `"in": "formData|path|query"`
 * To make the current field mendatery use `"required": true`
 * so, a field(parameter) will be { name: "firstName", "type": "string", "in": "formData", "required": true }
 */

swagger({
    api: "/resetPassword",
    summary: "To Reset Password For a User",
    tags: "Reset Passwords",
    fields: [
        "uuid",
        "password"
    ]
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        resetPassword(req.body,function(error,result){
            response(req, error, result, null, (rs) => {
                res.status(rs.status).json(rs.json);
            });
            // if(err){
            //     console.log("Error in Reset Password---",err);
            //     res.status(400).json({ error: err });                
            // }else{
            //     console.log("Result in Reset Password---",result);
            //     res.status(200).json({ data: result })
            // }
        });

    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports=router;