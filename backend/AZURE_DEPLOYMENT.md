# Azure Deployment Guide

This guide will help you deploy the Second Chances backend to Azure App Service.

## Prerequisites

1. Azure account with active subscription
2. Azure CLI installed (optional, for CLI deployment)
3. Azure Cosmos DB account (for MongoDB)
4. Azure App Service plan

**⚠️ Important:** 
- **Azure for Students Starter** subscription **does NOT support** Cosmos DB
- If you have this subscription, see [STUDENT_SUBSCRIPTION_GUIDE.md](./STUDENT_SUBSCRIPTION_GUIDE.md) for alternatives
- For development, use **Local MongoDB** or **MongoDB Atlas** instead

**Note:** If you encounter issues with Azure Portal (stuck on "Review + Create"), see [AZURE_TROUBLESHOOTING.md](./AZURE_TROUBLESHOOTING.md) for solutions and alternative methods.

## Step 1: Create Azure Resources

### 1.1 Create Azure Cosmos DB (MongoDB API)

**Important:** Azure Cosmos DB has a **Free Tier** that provides:
- 1000 RU/s (Request Units per second) - enough for development
- 25 GB storage
- **No credit card required** for the free tier itself
- **Free forever** (not just a trial)

**Note:** Creating an Azure account may require credit card verification for identity purposes, but you won't be charged if you:
1. Use only free-tier services
2. Stay within free tier limits
3. Don't enable paid features

**To use Free Tier:**

**Option A: Azure Portal (if working)**
1. Go to Azure Portal → Create a resource
2. Search for "Azure Cosmos DB"
3. Select **MongoDB API**
4. Fill in:
   - Subscription: Your subscription (or create free account)
   - Resource Group: Create new or use existing
   - Account Name: `second-chances-db` (must be globally unique, lowercase only)
   - Location: Choose closest to your users
   - Capacity mode: **Provisioned throughput** 
   - **Enable Free Tier: YES** ⭐ (Important!)
   - Version: **4.2** or **5.0**
5. Click **Review + Create**, then **Create**

**Option B: Azure CLI (Recommended if Portal is stuck)**
```bash
# Login to Azure
az login

# Create Resource Group
az group create --name second-chances-rg --location eastus

# Create Cosmos DB with Free Tier
az cosmosdb create \
  --name second-chances-db \
  --resource-group second-chances-rg \
  --default-consistency-level Session \
  --locations regionName=eastus failoverPriority=0 \
  --enable-free-tier true \
  --kind MongoDB

# Get Connection String
az cosmosdb keys list \
  --name second-chances-db \
  --resource-group second-chances-rg \
  --type connection-strings
```

**If Portal is stuck, see [AZURE_TROUBLESHOOTING.md](./AZURE_TROUBLESHOOTING.md) for detailed solutions.**

**Alternative: Use Local MongoDB for Development**

If you prefer not to use Azure Cosmos DB, you can use a local MongoDB instance or MongoDB Atlas (which also has a free tier):
- Local: Install MongoDB on your machine
- MongoDB Atlas: Free M0 cluster (512MB storage, no credit card required)

**Get Connection String:**
1. Go to your Cosmos DB account
2. Navigate to **Connection String** in the left menu
3. Copy the **Primary Connection String**
   - Format: `mongodb://<username>:<password>@<account>.mongo.cosmos.azure.com:10255/<database>?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<account>@`

### 1.2 Create Azure App Service

1. Go to Azure Portal → Create a resource
2. Search for "Web App"
3. Fill in:
   - Subscription: Your subscription
   - Resource Group: Same as Cosmos DB
   - Name: `second-chances-backend` (must be globally unique)
   - Publish: **Code**
   - Runtime stack: **Node.js 18 LTS** or **Node.js 20 LTS**
   - Operating System: **Linux** (recommended) or **Windows**
   - Region: Same as Cosmos DB
   - App Service Plan: Create new or use existing
4. Click **Review + Create**, then **Create**

## Step 2: Configure App Settings

1. Go to your App Service in Azure Portal
2. Navigate to **Configuration** → **Application settings**
3. Add the following settings:

### Required Settings:

```
MONGODB_URI=<your-cosmos-db-connection-string>
JWT_SECRET=<generate-a-strong-random-secret>
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Optional Settings:

```
UPLOAD_DIR=D:\home\site\wwwroot\uploads  (Windows)
UPLOAD_DIR=/home/site/wwwroot/uploads    (Linux)
MAX_FILE_SIZE=5242880
PORT=8080  (Azure sets this automatically, but you can override)
```

### For Azure Cosmos DB Connection String:

If using Azure App Service Connection Strings feature:
- Go to **Configuration** → **Connection strings**
- Add connection string:
  - Name: `MONGODB_URI`
  - Value: Your Cosmos DB connection string
  - Type: **Custom**

**Note:** Azure App Service automatically prefixes connection strings with `CUSTOMCONNSTR_` in environment variables. The code handles both `MONGODB_URI` and `CUSTOMCONNSTR_MONGODB_URI`.

## Step 3: Deploy Code

### Option A: Deploy via Azure Portal (ZIP Deploy)

1. Build your project locally:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. Create a ZIP file of the `backend` folder (include `node_modules` and `dist`)

3. Go to Azure Portal → Your App Service
4. Navigate to **Deployment Center**
5. Select **Local Git** or **ZIP Deploy**
6. Upload your ZIP file

### Option B: Deploy via Azure CLI

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription "Your Subscription Name"

# Create deployment package
cd backend
npm install
npm run build
cd ..

# Deploy (replace with your resource group and app name)
az webapp deploy \
  --resource-group your-resource-group \
  --name second-chances-backend \
  --src-path ./backend \
  --type zip
```

### Option C: Deploy via GitHub Actions

1. Fork/clone the repository
2. Go to Azure Portal → Your App Service → **Deployment Center**
3. Select **GitHub** as source
4. Authorize and select your repository
5. Configure:
   - Branch: `main`
   - Build provider: **GitHub Actions**
6. Azure will create a workflow file automatically

Or use the provided `azure-deploy.yml` workflow file.

### Option D: Deploy via VS Code

1. Install **Azure App Service** extension in VS Code
2. Sign in to Azure
3. Right-click on the `backend` folder
4. Select **Deploy to Web App**
5. Select your App Service

## Step 4: Configure Startup Command

1. Go to Azure Portal → Your App Service → **Configuration** → **General settings**
2. Set **Startup Command**:
   ```
   node dist/server.js
   ```
   Or for PM2 (optional):
   ```
   pm2 start dist/server.js --no-daemon
   ```

## Step 5: Enable WebSocket Support

1. Go to Azure Portal → Your App Service → **Configuration** → **General settings**
2. Enable **Web sockets**: **On**

## Step 6: Configure CORS

Update `CORS_ORIGIN` in App Settings to your frontend URL:
- Development: `http://localhost:8081`
- Production: `https://your-frontend-domain.com`

For multiple origins, you may need to update the CORS middleware in `server.ts`.

## Step 7: File Storage (Optional - Use Azure Blob Storage)

For production, consider using Azure Blob Storage instead of local file system:

1. Create Azure Storage Account
2. Create a container for uploads
3. Install Azure Storage SDK:
   ```bash
   npm install @azure/storage-blob
   ```
4. Update upload middleware to use Blob Storage

## Step 8: Seed Initial Data

After deployment, run the seed script:

1. Go to Azure Portal → Your App Service → **SSH** or **Console**
2. Navigate to your app directory
3. Run:
   ```bash
   npm run seed
   ```

Or use Azure Cloud Shell:
```bash
az webapp ssh --resource-group your-resource-group --name second-chances-backend
```

## Step 9: Test Deployment

1. Check health endpoint:
   ```
   https://your-app-name.azurewebsites.net/api/health
   ```

2. Test API:
   ```bash
   curl https://your-app-name.azurewebsites.net/api/health
   ```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | Cosmos DB connection string | `mongodb://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `NODE_ENV` | Environment | `production` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://your-app.com` |
| `PORT` | Server port (auto-set by Azure) | `8080` |
| `UPLOAD_DIR` | Upload directory | `/home/site/wwwroot/uploads` |

## Troubleshooting

### Connection Issues

1. **MongoDB Connection Fails:**
   - Verify connection string is correct
   - Check Cosmos DB firewall rules (allow Azure services)
   - Ensure Cosmos DB account is running

2. **Port Issues:**
   - Azure sets PORT automatically
   - Don't hardcode port in code
   - Use `process.env.PORT` or the `getPort()` helper

### File Upload Issues

1. **Uploads Not Persisting:**
   - Azure App Service file system is ephemeral
   - Use Azure Blob Storage for production
   - Or use Azure Files for persistent storage

2. **Permission Errors:**
   - Check directory permissions
   - Ensure upload directory exists

### WebSocket Issues

1. **WebSocket Not Working:**
   - Enable WebSockets in App Service settings
   - Check if your App Service plan supports WebSockets
   - Verify Socket.io configuration

### Build Issues

1. **Build Fails:**
   - Check Node.js version matches App Service runtime
   - Verify all dependencies are in `package.json`
   - Check build logs in Deployment Center

## Monitoring

1. **Application Insights:**
   - Enable Application Insights in App Service
   - Monitor performance and errors

2. **Logs:**
   - View logs in **Log stream** or **Logs** section
   - Enable Application Logging in App Service settings

## Scaling

1. **Scale Up:**
   - Go to App Service → **Scale up (App Service plan)**
   - Choose higher tier for more resources

2. **Scale Out:**
   - Go to App Service → **Scale out (App Service plan)**
   - Add more instances for horizontal scaling

## Security

1. **HTTPS:**
   - Azure App Service provides HTTPS by default
   - Custom domain: Configure SSL certificate

2. **Environment Variables:**
   - Never commit secrets to code
   - Use Azure Key Vault for sensitive data

3. **CORS:**
   - Restrict CORS_ORIGIN to your frontend domain only
   - Don't use wildcards in production

## Cost Optimization

1. **Use Free/Shared Tier for Development:**
   - Free tier available for testing
   - Shared tier for low-traffic apps

2. **Cosmos DB:**
   - Use Serverless mode for development
   - Provisioned throughput for production
   - Monitor RU/s usage

## Next Steps

1. Set up custom domain
2. Configure SSL certificate
3. Set up CI/CD pipeline
4. Enable Application Insights
5. Configure auto-scaling
6. Set up backup and disaster recovery

## Support

- Azure Documentation: https://docs.microsoft.com/azure/app-service/
- Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/
- App Service Troubleshooting: https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs

