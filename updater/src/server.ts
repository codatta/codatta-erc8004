import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import config from "config";
import {DID} from "./did";

const app = express();
const PORT = (config.get("server.port") as number) || 3001;

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

interface AgentDocument {
  type: string;
  name: string;  // DID format
  [key: string]: any;
}

// PUT /document/:id - receive DID Document JSON
app.put("/document/:id", async (req: Request, res: Response) => {
  const did = req.params.id;
  const body = req.body;

  console.log('[DID] Uploading document:', did);

  // validate
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const doc = body as DIDDocument;

  if (!doc.id) {
    return res.status(400).json({ error: "DID Document must contain an `id` field" });
  }

  // save locally
  if (!fs.existsSync(config.get("did.localDir"))) {
    fs.mkdirSync(config.get("did.localDir"), { recursive: true });
  }

  const savePath = path.join(config.get("did.localDir"), `${did}.json`);
  fs.writeFileSync(savePath, JSON.stringify(doc, null, 2));
  
  // push to S3 and get URL
  const s3Url = await DID.getInstance().pushDidDocument(did);

  return res.json({
    success: true,
    message: "DID Document uploaded",
    file: savePath,
    s3Url: s3Url,
  });
});

// PUT /agent/:id - receive Agent Document JSON
app.put("/agent/:id", async (req: Request, res: Response) => {
  const did = req.params.id;
  const body = req.body;

  console.log('[Agent] Uploading document:', did);

  // validate
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const doc = body as AgentDocument;

  if (!doc.name) {
    return res.status(400).json({ error: "Agent Document must contain a `name` field" });
  }

  // validate name is DID format
  if (!doc.name.startsWith('did:')) {
    return res.status(400).json({ error: "Agent Document `name` field must be in DID format" });
  }

  // save locally
  if (!fs.existsSync(config.get("agent.localDir"))) {
    fs.mkdirSync(config.get("agent.localDir"), { recursive: true });
  }

  const savePath = path.join(config.get("agent.localDir"), `${did}.json`);
  fs.writeFileSync(savePath, JSON.stringify(doc, null, 2));
  
  // push to S3 (using agent config) and get URL
  const s3Url = await DID.getInstance().pushAgentDocument(did);

  return res.json({
    success: true,
    message: "Agent Document uploaded",
    file: savePath,
    s3Url: s3Url,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Accessible from network on port ${PORT}`);
});
