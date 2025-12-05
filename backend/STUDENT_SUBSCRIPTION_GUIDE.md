# Azure for Students Starter - Limitations & Solutions

## Issue: Subscription Limitation

**Azure for Students Starter** subscription has restrictions and **does not support**:
- ❌ Azure Cosmos DB
- ❌ Many premium Azure services
- ❌ Production workloads

This is a limitation of the free student subscription tier.

## Solutions

### Solution 1: Use Local MongoDB (Recommended for Development)

This is the **easiest and fastest** solution for development:

#### Windows Installation:

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and run installer

2. **Install:**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - MongoDB will start automatically

3. **Verify Installation:**
   ```powershell
   # Open PowerShell and check if MongoDB is running
   Get-Service MongoDB
   ```

4. **Update Backend Configuration:**
   - Create `.env` file in `backend/` folder:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/second-chances
   JWT_SECRET=your-local-dev-secret
   CORS_ORIGIN=http://localhost:8081
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ```

5. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   # Or for development:
   npm run dev
   ```

**That's it!** You can now develop locally without any Azure services.

---

### Solution 2: Use MongoDB Atlas (Free Cloud Database)

MongoDB Atlas offers a **free M0 cluster** with:
- ✅ 512 MB storage
- ✅ No credit card required
- ✅ Perfect for development
- ✅ Works with your student subscription

#### Setup Steps:

1. **Sign Up:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free account (no credit card needed)

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose **FREE (M0)** tier
   - Select cloud provider (AWS, Azure, or GCP)
   - Choose region closest to you
   - Cluster name: `second-chances-cluster`
   - Click "Create"

3. **Create Database User:**
   - Username: `secondchances` (or your choice)
   - Password: Create a strong password (save it!)
   - Click "Create Database User"

4. **Configure Network Access:**
   - Click "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP for better security
   - Click "Confirm"

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: **Node.js**
   - Version: **5.5 or later**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `second-chances`

   Example:
   ```
   mongodb+srv://secondchances:YourPassword@cluster0.xxxxx.mongodb.net/second-chances?retryWrites=true&w=majority
   ```

6. **Update Backend Configuration:**
   - Update `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://secondchances:YourPassword@cluster0.xxxxx.mongodb.net/second-chances?retryWrites=true&w=majority
   ```

7. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

---

### Solution 3: Upgrade Azure Subscription (For Production)

If you need Azure Cosmos DB for production deployment:

#### Option A: Azure for Students (Full)

1. **Upgrade Subscription:**
   - Go to Azure Portal → Subscriptions
   - Look for upgrade options
   - Azure for Students (full) includes $100 credit
   - Still requires student verification

2. **Note:** Even with full student subscription, Cosmos DB may have limitations

#### Option B: Pay-As-You-Go (For Production)

1. **Create New Subscription:**
   - Go to Azure Portal → Subscriptions
   - Create new subscription
   - Choose "Pay-As-You-Go"
   - **Important:** Cosmos DB Free Tier is still available (1000 RU/s, 25 GB free)

2. **Cost:** Free tier is free, but you'll need a payment method on file

#### Option C: Use Azure Free Account

1. **Create New Account:**
   - Go to: https://azure.microsoft.com/free/
   - Create new account (separate from student account)
   - Get $200 credit for 30 days
   - Free tier services after credit expires

---

## Comparison Table

| Solution | Cost | Credit Card | Setup Time | Best For |
|----------|------|-------------|------------|----------|
| **Local MongoDB** | Free | No | 5 minutes | Development |
| **MongoDB Atlas** | Free | No | 10 minutes | Cloud Development |
| **Azure Cosmos DB** | Free tier | Verification* | 15+ minutes | Azure Production |

*May require card verification but won't charge for free tier

---

## Recommended Approach

### For Development (Now):
✅ **Use Local MongoDB** or **MongoDB Atlas**
- No subscription limitations
- Free forever
- Perfect for learning and development
- Can switch to Azure later

### For Production (Later):
✅ **Upgrade subscription** or **use MongoDB Atlas** (also has production options)
- MongoDB Atlas has paid tiers if needed
- Or upgrade Azure subscription when ready

---

## Quick Start: Local MongoDB (5 Minutes)

1. **Download:** https://www.mongodb.com/try/download/community
2. **Install:** Run installer (default options)
3. **Update `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/second-chances
   ```
4. **Start backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

**Done!** You're ready to develop.

---

## Troubleshooting

### MongoDB Not Starting (Windows)

```powershell
# Check service status
Get-Service MongoDB

# Start service manually
Start-Service MongoDB

# Or restart
Restart-Service MongoDB
```

### Connection Issues

1. **Check MongoDB is running:**
   ```bash
   # Windows
   Get-Service MongoDB
   
   # Or check in Services app
   services.msc
   ```

2. **Test connection:**
   ```bash
   # Open MongoDB shell
   mongosh
   # Or older versions:
   mongo
   ```

3. **Check port 27017:**
   ```powershell
   # Windows
   netstat -an | findstr 27017
   ```

### MongoDB Atlas Connection Issues

1. **Check network access:**
   - Ensure your IP is whitelisted
   - Or use 0.0.0.0/0 for development

2. **Verify connection string:**
   - Make sure password is URL-encoded
   - Replace `<password>` and `<dbname>` correctly

3. **Check cluster status:**
   - Ensure cluster is running (not paused)

---

## Next Steps

1. ✅ Choose your database solution (Local MongoDB recommended)
2. ✅ Set up database
3. ✅ Configure `.env` file
4. ✅ Install backend dependencies: `npm install`
5. ✅ Seed initial data: `npm run seed` (optional)
6. ✅ Start developing!

---

## Summary

**Your student subscription can't create Cosmos DB, but that's fine!**

**Best Solution:** Use **Local MongoDB** for development. It's:
- Free
- Fast
- No limitations
- Perfect for learning
- Easy to set up

You can always migrate to Azure Cosmos DB later when you:
- Upgrade your subscription
- Deploy to production
- Need Azure-specific features

For now, focus on development with Local MongoDB or MongoDB Atlas! 🚀

