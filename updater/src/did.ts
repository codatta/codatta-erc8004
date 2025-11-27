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

  async pushDidDocument(did: string) {
    // step 1: DID → UUID
    const uuid = utils.parseDid(did);

    // step 2: UUID → uint128
    const uint128 = utils.uuidToUint128(uuid);

    // filepath：<uint128>.json
    const filename = `${uint128}.json`;
    const filePath = path.join(config.get("did.localDir"), `${uuid}.json`);
    const s3Key = path.join(config.get("did.s3.root"), filename);

    // step 3: read file
    if (!fs.existsSync(filePath)) {
        console.log(`file not exist: ${filePath}`);
        return;
    }
    const data = fs.readFileSync(filePath, "utf8");

    // step 4: upload to S3
    await S3.getInstance().uploadToS3(config.get("did.s3.bucket"), s3Key, data);
  }
}
