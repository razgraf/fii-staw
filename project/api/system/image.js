"use strict";
const { RESOURCES } = require("../constants");

const AWS = require("aws-sdk");
const S3 = new AWS.S3();

class Image {
  static async saveToBucket({ key, data }) {
    const buffer = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    await Image.uploadToS3(RESOURCES.BUCKET, key, buffer);

    return Image.getPublicUrlFromS3(key, RESOURCES.BUCKET, RESOURCES.REGION);
  }

  static getFromS3(bucket, key, type = "image/jpeg") {
    return S3.getObject({
      Bucket: bucket,
      Key: key,
      ResponseContentType: type
    }).promise();
  }

  static uploadToS3(
    bucket,
    key,
    body,
    type = "image/jpeg",
    encoding = "base64",
    permission = "public-read"
  ) {
    return S3.putObject({
      Body: body,
      Bucket: bucket,
      ContentEncoding: encoding,
      ContentType: type,
      Key: key,
      ACL: permission
    }).promise();
  }

  static getSignedUrlFromS3(bucket, key) {
    return S3.getSignedUrl("getObject", { Bucket: bucket, Key: key });
  }

  static getPublicUrlFromS3(
    file,
    bucket = RESOURCES.BUCKET,
    region = RESOURCES.REGION
  ) {
    return `https://${bucket}.s3-${region}.amazonaws.com/${file}`;
  }
}

module.exports = Image;
