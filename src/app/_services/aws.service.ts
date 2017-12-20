import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AwsService {
  private s3: any;

  constructor() {
    // AWS.config.region = 'us-east-2';
    // AWS.config.loadFromPath('../../../../aws_credentials.json')
    this.s3 = new AWS.S3({
      accessKeyId: "<ACCESS_KEY>",
      secretAccessKey: "<SECRET_KEY>",
      region: "<REGION>"
    });
  }

  getS3SignedUrl(params: any):string {
    // var params = {Bucket: 'test-bucket-exp', Key: '111.jpg'};
    return this.s3.getSignedUrl('getObject', params);
  }

  listS3Objects(bucketName: string, maxKeys: number, continuationToken: string): Promise<any> {
    var params: any;
    if(continuationToken.length > 0) {
      params = {
        Bucket: bucketName, 
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken
      }      
    } else {
      params = {
        Bucket: bucketName, 
        MaxKeys: maxKeys
      }
    }

    var that =  this;
    return new Promise(function(resolve, reject) {
      that.s3.listObjectsV2(params, function(err: any, data: any) {
        if (err) {
          reject(err);
        } else {
          // data.Contents.forEach((s3Object: any) => { 
          //   s3Object['signedURL'] = that.s3.getSignedUrl('getObject', {Bucket: params.Bucket, Key: s3Object.Key}) 
          // });    
          resolve(data);
        }
      });
    })
  }
 }