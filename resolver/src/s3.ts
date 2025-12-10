import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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

  async getFromS3(bucket: string, key: string): Promise<string | null> {
    try {
      const cmd = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const response = await this.client.send(cmd);
      
      if (!response.Body) {
        console.log(`No data found for s3://${bucket}/${key}`);
        return null;
      }

      // Convert the readable stream to string
      const bodyContents = await response.Body.transformToString();
      console.log(`Retrieved from s3://${bucket}/${key}`);
      return bodyContents;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        console.log(`File not found: s3://${bucket}/${key}`);
        return null;
      }
      throw error;
    }
  }
}

