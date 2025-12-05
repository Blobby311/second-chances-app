# Development Setup Guide

This guide covers setting up the backend for local development without requiring Azure services or credit cards.

## Option 1: Local MongoDB (Recommended for Development)

### Install MongoDB Locally

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a Windows service
4. Default connection: `mongodb://localhost:27017`

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Configure Backend

1. Create `.env` file in `backend/` directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/second-chances
JWT_SECRET=your-local-dev-secret
CORS_ORIGIN=http://localhost:8081
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Build and run:
```bash
npm run build
npm start
# Or for development with auto-reload:
npm run dev
```

## Option 2: MongoDB Atlas (Free Cloud Database)

MongoDB Atlas offers a **free M0 cluster** with:
- 512 MB storage
- Shared RAM and vCPU
- **No credit card required**
- Perfect for development

### Setup Steps:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (no credit card needed)
3. Create a free M0 cluster:
   - Choose a cloud provider (AWS, Azure, or GCP)
   - Select a region
   - Cluster name: `second-chances-cluster`
4. Create database user:
   - Username and password
   - Save credentials securely
5. Configure network access:
   - Add IP address: `0.0.0.0/0` (allow from anywhere) for development
   - Or add your specific IP for better security
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Configure Backend

Update `.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/second-chances?retryWrites=true&w=majority
```

## Option 3: Azure Cosmos DB Free Tier

Azure Cosmos DB free tier provides:
- 1000 RU/s throughput
- 25 GB storage
- **Free forever** (not a trial)
- No credit card required for the free tier itself

**Note:** Creating an Azure account may require credit card verification for identity, but you won't be charged if you:
- Only use free-tier services
- Stay within free tier limits
- Don't enable paid features

### Setup Steps:

1. Create Azure account (if needed)
2. Go to Azure Portal → Create Azure Cosmos DB
3. **Important:** Enable "Free Tier" option
4. Get connection string from Azure Portal
5. Update `.env` with connection string

See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for detailed instructions.

## Comparison

| Option | Cost | Credit Card | Storage | Best For |
|--------|------|-------------|---------|----------|
| Local MongoDB | Free | No | Unlimited | Local development |
| MongoDB Atlas | Free | No | 512 MB | Cloud development |
| Azure Cosmos DB Free | Free | Verification* | 25 GB | Azure deployment |

*Credit card may be required for account verification but not charged for free tier

## Recommended Setup

**For Development:**
- Use **Local MongoDB** or **MongoDB Atlas**
- No Azure account needed
- No credit card needed

**For Production:**
- Use **Azure Cosmos DB** (if deploying to Azure)
- Or **MongoDB Atlas** (if using other cloud providers)

## Troubleshooting

### MongoDB Connection Issues

1. **Connection refused:**
   - Check if MongoDB is running: `mongod --version`
   - Start MongoDB service
   - Check if port 27017 is available

2. **Authentication failed:**
   - Verify username and password
   - Check database user permissions
   - For Atlas: Check network access settings

3. **Connection timeout:**
   - Check firewall settings
   - Verify connection string format
   - For Atlas: Add your IP to network access list

### Environment Variables

Make sure your `.env` file is in the `backend/` directory and contains all required variables.

## Next Steps

1. Choose your database option
2. Set up database
3. Configure `.env` file
4. Install dependencies: `npm install`
5. Seed initial data: `npm run seed` (optional)
6. Start server: `npm run dev`

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Azure Cosmos DB: https://docs.microsoft.com/azure/cosmos-db/

