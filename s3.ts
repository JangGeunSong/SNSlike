import * as AWS from 'aws-sdk'
// const AWS = require('aws-sdk');
// Call the AWS link tool

AWS.config.loadFromPath('./awsconfig.json');
// Link to project to AWS own account
/*
    awsconfig.json file has very important security infomation. You must hide and protect this file infomation.
*/

const s3 = new AWS.S3();
// S3 module create.

export default s3;
// Export S3 to other project modules wrapping method.

/*
    If you want to use s3 upload and delete method on the project, you need to understand how to write parameter for your upload properly.

    For example >>
    let uploadParam = {
        Bucket: 'sjg-bucket-com', 
        Key: 'static/profile/' + filename, 
        Body: await createReadStream()
    }

    This is parameter for upload file server to aws s3 bucket

    Bucket: This is bucket name that you already made.
    key: This is file path and name for your s3 bucket.
    Body: This is file stream for any you wanna use for file infomation sending.

    This 3 part is most important thing for upload file on the s3 system on your account at your own project.
*/