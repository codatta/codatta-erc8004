import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "config";

export class S3 {
  private static _instance: S3;
  private client: S3Client;

  constructor() {
    const s3 = config.get("s3") as any;
    this.client = new S3Client({
        region: s3.region,
        credentials: {
            accessKeyId: s3.accessKeyId,
            secretAccessKey: s3.secretAccessKey,
        },
    });
}

  static getInstance() {
    if (!S3._instance) {
      S3._instance = new S3();
    }
    return S3._instance;
  }

  async uploadToS3(bucket: string, key: string, body: string) {

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "application/json",
    });

    await this.client.send(cmd);
    console.log(`Uploaded to s3://${bucket}/${key}`);
  }
}
