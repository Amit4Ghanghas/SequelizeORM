const express = require('express');
const router = express.Router();
const { get, add, edit, remove } = require('../services/FeaturesService');
const generateUUID = require('../utilities/uuidGenerator');
const cleanBody = require('../utilities/cleanBody');
var { swagger } = require('../config/swagger/swagger');
const { response } = require('../utilities/responseStructure');


/**
 * in swagger default mathod is post, if you are using other then post please add `method: "GET|PUT|PATCH|DELETE"`
 * Default feild type is `string` to use this add `"type": "string|number|integer|password|date|date-time|boolean|array|object"`
 * Default feild in `formData` to use this add `"in": "formData|path|query"`
 * To make the current field mendatery use `"required": true`
 * so, a field(parameter) will be { name: "firstName", "type": "string", "in": "formData", "required": true }
 */

/************************ Featching all the portal features ******************/
swagger({
    api: "/features",
    method: "get",
    summary: "Fetch all the portal features",
    tags: "FEATURES",
    fields: [
        { name: "search", required: false, in: "query", type: "string" },
        { name: "filter", required: false, in: "query", type: "string" },
        { name: "page", required: false, in: "query", type: "integer" },
        { name: "limit", required: false, in: "query", type: "integer" }
    ]
});
router.get('/', (req, res, next) => {
    try {
        get(req.body,(error, result, query)=>{
            response(req, error, result, query, (rs) => {
                res.status(rs.status).json(rs.json);
            });
        });
    } catch (error) {
        res.status(400).json(error);        
    }
});

/*********************** Adding a new portal feature *******************/
swagger({
    api: "/features",
    summary: "Add a new feature",
    tags: "FEATURES",
    fields: [
        "name",
        "application",
        "parent"
    ]
});
router.post('/', (req, res, next) => {
    try {
        let options = {
            featureId: generateUUID.uuid(),
            name: req.body.name,
            application: req.body.application,
            parent: req.body.parent,
            createdBy: req.user.userId
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

/************************ Update an existing feature ******************/
swagger({
    api: "/features/{featureId}",
    method: "put",
    summary: "Update an existing feature",
    tags: "FEATURES",
    fields: [
        { name: "featureId", required: false, in: "path", type: "string" },
        "name",
        "application",
        "parent"
        // "updatedBy"
    ]
});
router.put('/:featureId', async (req, res, next) => {
    try {
        let options = {};
        options.body=await cleanBody.clean(req.body);
        options.body.updatedBy=req.user.userId;
        options.featureId=req.params.featureId;
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

/************************ Delete an existing feature ******************/
swagger({
    api: "/features/{featureId}",
    method: "delete",
    summary: "Delete a feature",
    tags: "FEATURES",
    fields: [
        { name: "featureId", in: "path", type: "string" }
    ]
});
router.delete('/:featureId', (req, res, next) => {
    try {
        let options = {};        
        options.featureId=req.params.featureId;
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