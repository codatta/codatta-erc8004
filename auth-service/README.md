# Feedback Authorization Service

为 ReputationRegistry 的 `giveFeedback` 功能提供授权签名服务。

## 功能

- 生成 `feedbackAuth` 签名（289 字节）
- RESTful API 接口
- TypeScript 实现
- 支持 CORS
- 自动过期时间管理

---

## 快速开始

### 1. 安装依赖

```bash
cd auth-service
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入实际值
```

**必需配置：**
```env
AGENT_OWNER_PRIVATE_KEY=0x你的私钥
IDENTITY_REGISTRY_ADDRESS=0x740aA385eF5D72ee6BCedF38FFFa5990F21fbBc5
CHAIN_ID=2368
PORT=3003
CORS_ORIGINS=http://localhost:3000
```

⚠️ **安全提示：** 
- 私钥是敏感信息，不要提交到 git
- 生产环境使用硬件钱包或 KMS

### 3. 启动服务

**开发模式：**
```bash
npm run dev
```

**生产模式：**
```bash
npm run build
npm start
```

---

## API 文档

### POST /api/request-auth

请求 feedbackAuth 签名。

**请求：**
```json
{
  "agentId": "1",
  "clientAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7",
  "indexLimit": "10",   // 可选，默认 10
  "expiryDays": 30      // 可选，默认 30 天
}
```

**响应（成功）：**
```json
{
  "success": true,
  "feedbackAuth": "0x000000...(289字节)",
  "params": {
    "agentId": "1",
    "clientAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7",
    "indexLimit": "10",
    "expiry": 1734567890,
    "signerAddress": "0xYourAgentOwnerAddress"
  }
}
```

**响应（失败）：**
```json
{
  "success": false,
  "error": "Invalid clientAddress format"
}
```

### GET /health

健康检查。

**响应：**
```json
{
  "status": "ok",
  "service": "feedback-auth-service",
  "timestamp": "2025-12-11T12:00:00.000Z",
  "signer": "0xYourAgentOwnerAddress"
}
```

### GET /api/signer

获取签名者地址。

**响应：**
```json
{
  "signerAddress": "0xYourAgentOwnerAddress"
}
```

---

## 部署

### 本地部署

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

### PM2 部署（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 启动服务
pm2 start dist/server.js --name feedback-auth

# 查看状态
pm2 status

# 查看日志
pm2 logs feedback-auth

# 重启服务
pm2 restart feedback-auth

# 停止服务
pm2 stop feedback-auth
```

---

## License

MIT
