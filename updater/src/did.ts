import path from "path";
import fs from "fs";
import config from "config";
import { utils } from "./utils";
import { S3 } from "./s3";

/**
 * did manager
 */
export class DID {
    private static _instance: DID;

  constructor() {}

  static getInstance() {
    if (!DID._instance) {
      DID._instance = new DID();
    }
    return DID._instance;
  }

  async pushDidDocument(did: string): Promise<string> {
    // filepath：<did>.json
    const filePath = path.join(config.get("did.localDir") as string, `${did}.json`);
    const s3Key = path.join(config.get("did.s3.root") as string, `${did}.json`);
    const bucket = config.get("did.s3.bucket") as string;
    const region = config.get("s3.region") as string;

    // read file
    if (!fs.existsSync(filePath)) {
        console.log(`[DID] file not exist: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, "utf8");

    // upload to S3
    console.log(`[DID] Uploading to S3: ${s3Key}`);
    await S3.getInstance().uploadToS3(bucket, s3Key, data);
    console.log(`[DID] Upload complete: ${s3Key}`);

    // Return HTTPS URL (AWS S3 format)
    // Format: https://bucket.s3.region.amazonaws.com/key or https://bucket.s3.amazonaws.com/key (for us-east-1)
    const encodedKey = encodeURIComponent(s3Key);
    const httpsUrl = region === 'us-east-1' 
      ? `https://${bucket}.s3.amazonaws.com/${encodedKey}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
    
    return httpsUrl;
  }

  async pushAgentDocument(did: string): Promise<string> {
    // filepath：<did>.json
    const filePath = path.join(config.get("agent.localDir") as string, `${did}.json`);
    const s3Key = path.join(config.get("agent.s3.root") as string, `${did}.json`);
    const bucket = config.get("agent.s3.bucket") as string;
    const region = config.get("s3.region") as string;

    // read file
    if (!fs.existsSync(filePath)) {
        console.log(`[Agent] file not exist: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, "utf8");

    // upload to S3
    console.log(`[Agent] Uploading to S3: ${s3Key}`);
    await S3.getInstance().uploadToS3(bucket, s3Key, data);
    console.log(`[Agent] Upload complete: ${s3Key}`);

    // Return HTTPS URL (AWS S3 format)
    // Format: https://bucket.s3.region.amazonaws.com/key or https://bucket.s3.amazonaws.com/key (for us-east-1)
    const encodedKey = encodeURIComponent(s3Key);
    const httpsUrl = region === 'us-east-1' 
      ? `https://${bucket}.s3.amazonaws.com/${encodedKey}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
    
    return httpsUrl;
  }
}
