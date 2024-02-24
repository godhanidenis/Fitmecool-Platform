import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'C9HUS1QL9AYDS23OKRFL',
  secretAccessKey: 'lD1m2A0smGPtuZM9KB96TuLkUCwnjqNAhwt3BUje',
  region: 'us-east-1',
  endpoint: 's3.us-east-1.wasabisys.com',
});

export const s3 = new AWS.S3();

export const destinationBucketName = 'rentbless-prod';

// export const destinationBucketName = 'rentbless-dev';
