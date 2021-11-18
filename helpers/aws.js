var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
s3 = new AWS.S3();

module.exports = s3;