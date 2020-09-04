const AWS = require('aws-sdk');
require('dotenv').config()


AWS.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECERT_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
});

const s3 = new AWS.S3();

async function url(req) {
    req = req.replace("https://" + process.env.AWS_S3_BUCKET + ".s3.ap-south-1.amazonaws.com/", "");
    req = req.replace("%3D", "=");
    const myBucket = process.env.AWS_S3_BUCKET;
    const myKey = req;
    const signedUrlExpireSeconds = 600 * 10;

    const url =s3.getSignedUrl('getObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
    });
    return (url);
}

var urlSignerList = async (input, list) => {
    var result=[];
    console.log("In URL SIGNER");
    console.log(input);
    
    if (input.length > 0) {
        await input.forEach(async element => {
            await list.forEach(async listEle => {
                if (element[listEle] && element[listEle].length > 0)
                element[listEle] =await url(element[listEle]);
            });
            result.push(element)
        });
    }
    return result;
}

module.exports = {
    url: url,
    urlSignerList
}