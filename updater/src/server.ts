import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import config from "config";
import {DID} from "./did";

const app = express();
const PORT = config.get("server.port") || 3001;

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());

interface DIDDocument {
  "@context": string | string[];
  id: string;
  [key: string]: any;
}

// PUT /upload: receive DID Document JSON
app.put("/document/:id", async (req: Request, res: Response) => {
  const did = req.params.id;
  const body = req.body;

  console.log('body', body)

  // validate
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const doc = body as DIDDocument;

  if (!doc.id) {
    return res.status(400).json({ error: "DID Document must contain an `id` field" });
  }

  // save
  if (!fs.existsSync(config.get("did.localDir"))) {
    fs.mkdirSync(config.get("did.localDir"), { recursive: true });
  }

  // file name, did:example:123.json
  const savePath = path.join(config.get("did.localDir"), `${did}.json`);

  fs.writeFileSync(savePath, JSON.stringify(doc, null, 2));
  
  await DID.getInstance().pushDidDocument(did);

  return res.json({
    success: true,
    message: "DID Document uploaded",
    file: savePath,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
