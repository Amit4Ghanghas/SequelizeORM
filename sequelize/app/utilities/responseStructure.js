const db = require('../config/sequelize');

let responseCode = {
    "success": {
        "get": { "code": 200 },
        "put": { "code": 204 },
        "post": { "code": 201 },
        "patch": { "code": 204 },
        "delete": { "code": 202 }
    },
    "error": {
        "badreq": { "code": 400 },
        "unauthenticated": { "code": 401 },
        "forbidden": { "code": 403 },
        "notfound": { "code": 404 },
        "ise": { "code": 500 }
    }
};

(response) = async(req, error, data, query, callback) => {
    if(error) {
        console.log("Hello",error);
        callback({ status: responseCode.error['badreq'].code, json: { "message": error } });
    } else if(data){
        let resJson = {};
        if(query && query.cl) {
            console.log("Query---",query);
            
            resJson["totalRecords"] = await db[query.cl].count();
            if(query.where) {
                resJson["filteredRecords"] = await db[query.cl].count(query.where);
            }
        }
        resJson["data"] = data;
        callback({ status: responseCode.success[req.method.toLowerCase()].code, json: resJson });
    }
}

module.exports = {
    response
}