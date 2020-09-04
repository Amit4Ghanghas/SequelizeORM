const express = require('express');
const router = express.Router();
const generateUUID = require('../utilities/uuidGenerator');
const { swagger } = require('../config/swagger/swagger');
const { get, add, edit, remove } = require('../services/RolesService');
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
    api: "/roles",
    summary: "Fetch all roles",
    method: "get",
    tags: "ROLES",
    fields: [
        { name: "search", required: false, in: "query", type: "string" },
        { name: "filter", required: false, in: "query", type: "string" },
        { name: "page", required: false, in: "query", type: "integer" },
        { name: "limit", required: false, in: "query", type: "integer" }
    ]
});
router.get('/', (req, res, next) => {    
    try {
        get(req.body,(error,result)=>{
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }
            response(req, error, result,null, (rs) => {
                res.status(rs.status).json(rs.json);
            }); 
        });           
    } catch (error) {
        res.status(400).json(error);        
    }
});


/************************ Create a role ******************/
swagger({
    api: "/roles",
    summary: "Create a role",
    tags: "ROLES",
    fields: [
        "name",
        "description"
    ]
});
router.post('/', (req, res, next) => {
    try {
        let options = {
            roleId: generateUUID.uuid(),
            name: req.body.name,
            description: req.body.description,
            createdBy:req.user.userId
        }
        add(options,(error,result)=>{
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // } 
            response(req, error, result,null, (rs) => {
                res.status(rs.status).json(rs.json);
            });   
        });
    } catch (error) {
        res.status(400).json(error);                
    }
});

/************************ Update a role ******************/
swagger({
    api: "/roles/{roleId}",
    method: "put",
    summary: "Update a role",
    tags: "ROLES",
    fields: [
        { name: "roleId", required: false, in: "path", type: "string" },
        "name",
        "description"
    ]
});
router.put('/:roleId', async (req, res, next) => { 
    try {
        let options = {};
        options.body=await cleanBody.clean(req.body);
        options.body.updatedBy=req.user.userId;
        options.roleId=req.params.roleId;
        edit(options,(error,result)=>{
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }   
            response(req, error, result,null, (rs) => {
                res.status(rs.status).json(rs.json);
            }); 
        });
    } catch (error) {
        res.status(400).json(error);                
    }
});

/************************ Delete a role ******************/
swagger({
    api: "/roles/{roleId}",
    method: "delete",
    summary: "Delete a role",
    tags: "ROLES",
    fields: [
        { name: "roleId", required: false, in: "path", type: "string" }
    ]
});
router.delete('/:roleId', (req, res, next) => {
    try {
        let options = {};        
        options.roleId=req.params.roleId;
        remove(options,(error,result)=>{
            // if(error){
            //     // console.log(error);                
            //     res.status(400).json({ error: error });
            // }else{
            //     // console.log(result);                
            //     res.status(200).json(result)         
            // }  
            response(req, error, result,null, (rs) => {
                res.status(rs.status).json(rs.json);
            });  
        });
    } catch (error) {
        res.status(400).json(error);                
    }
});


module.exports = router;