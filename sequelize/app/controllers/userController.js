const express = require('express');
const router = express.Router();
const generateUUID = require('../utilities/uuidGenerator');
const { swagger } = require('../config/swagger/swagger');
const { get, add, edit, remove,getById } = require('../services/UsersService');
const cleanBody = require('../utilities/cleanBody');
const { response } = require('../utilities/responseStructure');

/**
 * in swagger default mathod is post, if you are using other then post please add `method: "GET|PUT|PATCH|DELETE"`
 * Default feild type is `string` to use this add `"type": "string|number|integer|password|date|date-time|boolean|array|object"`
 * Default feild in `formData` to use this add `"in": "formData|path|query"`
 * To make the current field mendatery use `"required": true`
 * so, a field(parameter) will be { name: "firstName", "type": "string", "in": "formData", "required": true }
 */

/************************ Return all data of Role table ******************/
swagger({
    api: "/users",
    summary: "Fetch all users",
    method: "get",
    tags: "USERS",
    fields: [
        { name: "search", required: false, in: "query", type: "string" },
        { name: "filter", required: false, in: "query", type: "string" },
        { name: "page", required: false, in: "query", type: "integer" },
        { name: "limit", required: false, in: "query", type: "integer" }
    ]
});
router.get('/', (req, res, next) => {
    try {
        get(req.body, (error, result) => {
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }
            response(req, error, result, null, (rs) => {
                res.status(rs.status).json(rs.json);
            });
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

swagger({
    api: "/users/{userId}",
    method: "get",
    summary: "User get by id a user",
    tags: "USERS",
    fields: [
        { name: "userId", required: false, in: "path", type: "string" }
    ]
});
router.get('/:userId', async (req, res, next) => {
    try {
        let options={
            userId : req.params.userId
        }
        getById(options, (error, result) => {
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }   
            response(req, error, result, null, (rs) => {
                res.status(rs.status).json(rs.json);
            });
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

/************************ Create a user ******************/
// swagger({
//     api: "/users",
//     summary: "Create a user",
//     tags: "USERS",
//     fields: [
//         "name",
//         "description"
//     ]
// });
// router.post('/', (req, res, next) => {
//     try {
//         let options = {
//             userId: generateUUID.uuid(),
//             name: req.body.name,
//             description: req.body.description,
//             createdBy:req.user.userId
//         }
//         add(options,(error,result)=>{
//             // if(error){
//             //     // console.log(error);                
//             //     res.status(400).json({ error: error });
//             // }else{
//             //     // console.log(result);                
//             //     res.status(200).json(result)         
//             // } 
//             response(req, error, result,null, (rs) => {
//                 res.status(rs.status).json(rs.json);
//             });   
//         });
//     } catch (error) {
//         res.status(400).json(error);                
//     }
// });

/************************ Update a user ******************/
swagger({
    api: "/users/{userId}",
    method: "put",
    summary: "Update a user",
    tags: "USERS",
    fields: [
        { name: "userId", required: false, in: "path", type: "string" },
        "firstName",
        "lastName",
        "email",
        "phone",
        "isActive",
        "isRemoved"
    ]
});
router.put('/:userId', async (req, res, next) => {
    try {
        let options = {};
        options.body = await cleanBody.clean(req.body);
        options.body.updatedBy = req.user.userId;
        options.userId = req.params.userId;
        edit(options, (error, result) => {
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }   
            response(req, error, result, null, (rs) => {
                res.status(rs.status).json(rs.json);
            });
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

/************************ Delete a user ******************/
swagger({
    api: "/users/{userId}",
    method: "delete",
    summary: "Delete a user",
    tags: "USERS",
    fields: [
        { name: "userId", required: false, in: "path", type: "string" }
    ]
});
router.delete('/:userId', (req, res, next) => {
    try {
        let options = {};
        options.userId = req.params.userId;
        remove(options, (error, result) => {
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }  
            response(req, error, result, null, (rs) => {
                res.status(rs.status).json(rs.json);
            });
        });
    } catch (error) {
        res.status(400).json(error);
    }
});


module.exports = router;