
async function cleanObject(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return await obj;
  }

module.exports={
    clean:cleanObject
}