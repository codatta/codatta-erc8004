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
    const filePath = path.join(config.get("did.localDir"), `${did}.json`);
    const s3Key = path.join(config.get("did.s3.root"), `${did}.json`);

    // read file
    if (!fs.existsSync(filePath)) {
        console.log(`[DID] file not exist: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, "utf8");

    // upload to S3
    console.log(`[DID] Uploading to S3: ${s3Key}`);
    await S3.getInstance().uploadToS3(config.get("did.s3.bucket"), s3Key, data);
    console.log(`[DID] Upload complete: ${s3Key}`);

    // Return S3 URL
    const s3Url = `s3://${config.get("did.s3.bucket")}/${s3Key}`;
    return s3Url;
  }

  async pushAgentDocument(did: string): Promise<string> {
    // filepath：<did>.json
    const filePath = path.join(config.get("agent.localDir"), `${did}.json`);
    const s3Key = path.join(config.get("agent.s3.root"), `${did}.json`);

    // read file
    if (!fs.existsSync(filePath)) {
        console.log(`[Agent] file not exist: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, "utf8");

    // upload to S3
    console.log(`[Agent] Uploading to S3: ${s3Key}`);
    await S3.getInstance().uploadToS3(config.get("agent.s3.bucket"), s3Key, data);
    console.log(`[Agent] Upload complete: ${s3Key}`);

    // Return S3 URL
    const s3Url = `s3://${config.get("agent.s3.bucket")}/${s3Key}`;
    return s3Url;
  }
}
