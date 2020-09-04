const express = require('express');
const router = express.Router();
const generateUUID = require('../utilities/uuidGenerator');
const { swagger } = require('../config/swagger/swagger');
const { get, add, remove } = require('../services/UserRoleService');
const cleanBody = require('../utilities/cleanBody');
const { response } = require('../utilities/responseStructure');

swagger({
    api: "/userRole",
    summary: "Get Roles of User",
    method: "get",
    tags: "USER ROLES",
    fields: [   
        // "userId",
        // { name: "roleId", required: false, in: "object", type: "integer" }
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


swagger({
    api: "/userRole",
    summary: "Assign Role to User",
    // method: "post",
    tags: "USER ROLES",
    fields: [   
        "userId",
        { name: "roleId", required: false, in: "object", type: "integer" }
    ]
});
router.post('/', async(req, res, next) => {
    try {  
        // Input
        // {
        //     "userId":"9f794b7c-8620-47db-9979-44cbb538875f",
        //     "roleId": ["1e49276c-237e-4ee1-8c64-c03d8902a2f2","89251d7a-2440-4a1b-84dc-b79d182e9256"]
        // }
try {
    let finalResult=[];
    let i=0;
    await req.body.roleId.forEach(async element => {
        let options = {
            userRoleId: generateUUID.uuid(),
            userId: req.body.userId,
            roleId: element,
            createdBy: req.user.userId
        }
        await add(options,(error,result)=>{
            if(error){
                // console.log(error);  
                finalResult.push(error);              
            }else{
                // console.log(result); 
                finalResult.push(reuslt);              
            }   
        });    
        i++;
        if(i==req.body.roleId.length){
            res.status(200).json(finalResult)
        }
    });
    
} catch (error) {
    res.status(400).json(error)    
}
        
        
    } catch (error) {
        res.status(400).json(error);                
    }
});

swagger({
    api: "/userRole/{userRoleId}",
    summary: "Delete Role of User",
    method: "delete",
    tags: "USER ROLES",
    fields: [   
        // "userId",
        { name: "userRoleId", required: false, in: "path", type: "string" }
    ]
});
router.delete('/:userRoleId', (req, res, next) => {
    try {  
        let options = {};        
        options.userRoleId=req.params.userRoleId;
        remove(options,(error, result)=>{
            response(req, error, result, null, (rs) => {
                res.status(rs.status).json(rs.json);
            });
        });        
    } catch (error) {
        res.status(400).json(error);                
    }
});

module.exports=router
