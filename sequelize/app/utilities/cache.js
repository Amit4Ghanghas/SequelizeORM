// var mcache = require('memory-cache');
const NodeCache = require( "node-cache" );
const mcache = new NodeCache();

var getCache= async(key)=>{
    let cachedBody = await mcache.take(key);
    console.log("IN Get Cache cachedBody---",cachedBody);
    
    if (cachedBody) {
        console.log("Getting Cache");
        return cachedBody;
    }
}

var setCache= async(key,value,duration)=>{
    console.log("Key in set-----",key);
    console.log("Value in set---",value)
    
    var setValue=mcache.set(key, value, duration * 10000000)
    // .catch(err=>{
    //     console.log("Error in Set Value----",err);
    // });
    console.log("Set Value------",setValue);
    if(setValue){
        return key
    }else{
        throw TypeError("Error in Setting function");
    }
}

module.exports={
    getCache,
    setCache
};
