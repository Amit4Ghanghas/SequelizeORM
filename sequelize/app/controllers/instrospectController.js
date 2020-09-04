require('dotenv').config();
const router = require('express').Router()
const { swagger } = require('../config/swagger/swagger');
const passportAuth = require('../config/passport-config');
// const { response } = require('../utilities/responseStructure');

/**
 * in swagger default mathod is post, if you are using other then post please add `method: "GET|PUT|PATCH|DELETE"`
 * Default feild type is `string` to use this add `"type": "string|number|integer|password|date|date-time|boolean|array|object"`
 * Default feild in `formData` to use this add `"in": "formData|path|query"`
 * To make the current field mendatery use `"required": true`
 * so, a field(parameter) will be { name: "firstName", "type": "string", "in": "formData", "required": true }
 */
swagger({
    api: "/introspect",
    summary: "To Perform Token Authentication",
    tags: "INTROSPECT",
    // parameters: ["email", "password"]
});
router.post('/', (req, res) => {
    console.log("Host------",req.host,req.originalUrl,req.ip);
    res.status(200).json(req.user);
});

module.exports=router;