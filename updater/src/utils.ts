export class utils {
  /**
   * UUIDv4 to uint128
   * @param uuid 
   * @returns 
   */
  static uuidToUint128(uuid: string): bigint {
    // remove "-" in did
    const hex = uuid.replace(/-/g, "");
    if (hex.length !== 32) {
      throw new Error("Invalid UUIDv4 format");
    }

    // to BigInt（uint128）
    return BigInt("0x" + hex);
  }

  /**
   * exract UUID from did
   * @param did 
   * @returns 
   */
  static parseDid(did: string): string {
    // format: did:method:identifier
    const parts = did.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid DID format");
    }
    return parts[2]!; // UUIDv4
  }
}
