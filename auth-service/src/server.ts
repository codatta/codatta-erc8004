/**
 * Feedback Authorization Service
 * 为用户提供 feedbackAuth 签名的 HTTP 服务
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthGenerator, FeedbackAuthRequest } from './auth-generator';
import { isAddress, type Hex } from 'viem';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3003', 10);

// 验证环境变量
if (!process.env.AGENT_OWNER_PRIVATE_KEY) {
  throw new Error('Missing AGENT_OWNER_PRIVATE_KEY in environment');
}
if (!process.env.IDENTITY_REGISTRY_ADDRESS) {
  throw new Error('Missing IDENTITY_REGISTRY_ADDRESS in environment');
}

// 初始化授权生成器
const authGenerator = new AuthGenerator(
  process.env.AGENT_OWNER_PRIVATE_KEY as `0x${string}`,
  parseInt(process.env.CHAIN_ID || '2368'),
  process.env.IDENTITY_REGISTRY_ADDRESS as `0x${string}`
);

// 中间件
app.use(express.json());

// CORS 配置
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * POST /api/request-auth
 * 请求 feedbackAuth 签名
 * 
 * Body:
 * {
 *   "agentId": "1",
 *   "clientAddress": "0x...",
 *   "indexLimit": "10",     // 可选，默认 10
 *   "expiryDays": 30        // 可选，默认 30 天
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "feedbackAuth": "0x...",
 *   "params": {
 *     "agentId": "1",
 *     "clientAddress": "0x...",
 *     "indexLimit": "10",
 *     "expiry": 1234567890,
 *     "signerAddress": "0x..."
 *   }
 * }
 */
app.post('/api/request-auth', async (req: Request, res: Response) => {
  try {
    const { agentId, clientAddress, indexLimit, expiryDays } = req.body;

    // 验证必填参数
    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing agentId',
      });
    }

    if (!clientAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing clientAddress',
      });
    }

    // 验证地址格式
    if (!isAddress(clientAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid clientAddress format',
      });
    }

    // 构造请求
    const request: FeedbackAuthRequest = {
      agentId: BigInt(agentId),
      clientAddress: clientAddress as `0x${string}`,
      indexLimit: indexLimit ? BigInt(indexLimit) : undefined,
      expiryDays: expiryDays ? parseInt(expiryDays) : undefined,
    };

    // 验证请求
    const validation = authGenerator.validateRequest(request);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // 生成签名
    console.log('Generating feedbackAuth for:', {
      agentId: request.agentId.toString(),
      clientAddress: request.clientAddress,
      indexLimit: request.indexLimit?.toString() || '10',
      expiryDays: request.expiryDays || 30,
    });

    const feedbackAuth = await authGenerator.generateFeedbackAuth(request);

    // 返回结果
    return res.json({
      success: true,
      feedbackAuth,
      params: {
        agentId: request.agentId.toString(),
        clientAddress: request.clientAddress,
        indexLimit: (request.indexLimit || 10n).toString(),
        expiry: Math.floor(Date.now() / 1000) + (request.expiryDays || 30) * 86400,
        signerAddress: authGenerator.getSignerAddress(),
      },
    });

  } catch (error: any) {
    console.error('Error generating feedbackAuth:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * GET /health
 * 健康检查
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'feedback-auth-service',
    timestamp: new Date().toISOString(),
    signer: authGenerator.getSignerAddress(),
  });
});

/**
 * GET /api/signer
 * 获取签名者地址
 */
app.get('/api/signer', (req: Request, res: Response) => {
  res.json({
    signerAddress: authGenerator.getSignerAddress(),
  });
});

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 Feedback Authorization Service');
  console.log('='.repeat(50));
  console.log(`📡 Server: http://0.0.0.0:${PORT}`);
  console.log(`🔑 Signer: ${authGenerator.getSignerAddress()}`);
  console.log(`🔗 Chain ID: ${process.env.CHAIN_ID || 2368}`);
  console.log(`📝 Registry: ${process.env.IDENTITY_REGISTRY_ADDRESS}`);
  console.log('='.repeat(50));
  console.log('');
  console.log('📚 API Endpoints:');
  console.log(`  POST http://0.0.0.0:${PORT}/api/request-auth`);
  console.log(`  GET  http://0.0.0.0:${PORT}/health`);
  console.log(`  GET  http://0.0.0.0:${PORT}/api/signer`);
  console.log('');
});

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

