import path from "path";
import config from "config";
import { S3 } from "./s3";

/**
 * DID Document Resolver
 */
export class Resolver {
  private static _instance: Resolver;

  constructor() {}

  static getInstance() {
    if (!Resolver._instance) {
      Resolver._instance = new Resolver();
    }
    return Resolver._instance;
  }

  /**
   * Resolve a DID document from S3
   * @param did - The DID identifier (e.g., "did:example:123")
   * @returns The DID document as a JSON object, or null if not found
   */
  async resolveDidDocument(did: string): Promise<any | null> {
    // Construct S3 key: <root>/<did>.json
    const s3Key = path.join(config.get("did.s3.root"), `${did}.json`);
    const bucket = config.get("did.s3.bucket");

    // Fetch from S3
    const data = await S3.getInstance().getFromS3(bucket as string, s3Key);
    
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to parse DID document for ${did}:`, error);
      throw new Error("Invalid DID document format");
    }
  }
}

