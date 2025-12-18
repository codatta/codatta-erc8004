import express, { Request, Response, NextFunction } from "express";
import config from "config";
import { Resolver } from "./resolver";

const app = express();
const PORT = (config.get("server.port") as number) || 3002;

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());

/**
 * GET /resolve/:did
 * Resolve a DID document from S3
 * 
 * Example: GET /resolve/did:example:123
 */
app.get("/resolve/:did", async (req: Request, res: Response) => {
  try {
    const did = req.params.did;

    if (!did) {
      return res.status(400).json({ 
        error: "DID parameter is required" 
      });
    }

    console.log(`Resolving DID: ${did}`);

    const didDocument = await Resolver.getInstance().resolveDidDocument(did);

    if (!didDocument) {
      return res.status(404).json({
        error: "DID document not found",
        did: did,
      });
    }

    return res.json({
      success: true,
      didDocument: didDocument,
    });
  } catch (error: any) {
    console.error("Error resolving DID:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get("/health", (req: Request, res: Response) => {
  return res.json({
    status: "ok",
    service: "did-resolver",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DID Resolver service running on http://0.0.0.0:${PORT}`);
  console.log(`Accessible from network on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Resolve DID: http://localhost:${PORT}/resolve/:did`);
});

