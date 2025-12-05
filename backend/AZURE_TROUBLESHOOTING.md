# Azure Portal Troubleshooting Guide

## Issue: "Review + Create" Button Stuck/Not Loading

This is a common Azure Portal issue. Here are several solutions:

### Solution 1: Browser Troubleshooting

1. **Clear Browser Cache:**
   - Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Clear cached images and files
   - Try again

2. **Use Incognito/Private Mode:**
   - Open Azure Portal in incognito/private window
   - Try creating the resource again

3. **Try Different Browser:**
   - If using Chrome, try Edge or Firefox
   - Azure Portal works best with Microsoft Edge

4. **Disable Browser Extensions:**
   - Disable ad blockers, privacy extensions
   - Some extensions interfere with Azure Portal

5. **Hard Refresh:**
   - Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
   - This forces a complete page reload

### Solution 2: Use Azure CLI (Recommended Alternative)

If the portal is stuck, use Azure CLI instead:

#### Install Azure CLI

**Windows:**
```powershell
# Download and install from:
# https://aka.ms/installazurecliwindows
# Or use winget:
winget install -e --id Microsoft.AzureCLI
```

**macOS:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

#### Create Cosmos DB via CLI

```bash
# 1. Login to Azure
az login

# 2. Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "Your Subscription Name"

# 3. Create Resource Group (if needed)
az group create \
  --name second-chances-rg \
  --location eastus

# 4. Create Cosmos DB Account with Free Tier
az cosmosdb create \
  --name second-chances-db \
  --resource-group second-chances-rg \
  --default-consistency-level Session \
  --locations regionName=eastus failoverPriority=0 \
  --enable-free-tier true \
  --kind MongoDB

# 5. Get Connection String
az cosmosdb keys list \
  --name second-chances-db \
  --resource-group second-chances-rg \
  --type connection-strings
```

### Solution 3: Use Azure PowerShell

```powershell
# 1. Install Azure PowerShell (if not installed)
# Install-Module -Name Az -AllowClobber

# 2. Login
Connect-AzAccount

# 3. Create Resource Group
New-AzResourceGroup -Name "second-chances-rg" -Location "eastus"

# 4. Create Cosmos DB
New-AzCosmosDBAccount `
  -ResourceGroupName "second-chances-rg" `
  -Name "second-chances-db" `
  -ApiKind "MongoDB" `
  -Location "eastus" `
  -EnableFreeTier $true

# 5. Get Connection String
Get-AzCosmosDBAccountKey `
  -ResourceGroupName "second-chances-rg" `
  -Name "second-chances-db" `
  -Type "ConnectionStrings"
```

### Solution 4: Portal Workarounds

1. **Try Different Region:**
   - Some regions may have portal issues
   - Try a different location (eastus, westus, westeurope, etc.)

2. **Create from Marketplace:**
   - Go to Azure Marketplace
   - Search "Azure Cosmos DB"
   - Click "Create" from there

3. **Use Quickstart Templates:**
   - Go to Azure Portal → Create a resource
   - Search "Cosmos DB Quickstart"
   - Use the quickstart template

4. **Wait and Retry:**
   - Sometimes Azure Portal has temporary issues
   - Wait 5-10 minutes and try again
   - Check Azure Status: https://status.azure.com/

### Solution 5: Check Azure Portal Status

1. Visit: https://status.azure.com/
2. Check if there are any ongoing issues
3. Check your specific region status

### Solution 6: Validate Form Fields

Make sure all required fields are filled:
- ✅ Subscription selected
- ✅ Resource Group created/selected
- ✅ Account Name is unique (no special characters, lowercase)
- ✅ Location selected
- ✅ API: MongoDB selected
- ✅ Capacity mode selected

**Common Issues:**
- Account name already taken (must be globally unique)
- Invalid characters in account name (use only lowercase letters and numbers)
- Missing required field

### Solution 7: Use Azure Resource Manager Template

Create a file `cosmosdb-template.json`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "accountName": {
      "type": "string",
      "defaultValue": "second-chances-db"
    },
    "location": {
      "type": "string",
      "defaultValue": "eastus"
    }
  },
  "resources": [
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2021-05-15",
      "name": "[parameters('accountName')]",
      "location": "[parameters('location')]",
      "kind": "MongoDB",
      "properties": {
        "enableFreeTier": true,
        "databaseAccountOfferType": "Standard",
        "locations": [
          {
            "locationName": "[parameters('location')]",
            "failoverPriority": 0
          }
        ],
        "capabilities": [
          {
            "name": "EnableMongo"
          }
        ]
      }
    }
  ]
}
```

Deploy via CLI:
```bash
az deployment group create \
  --resource-group second-chances-rg \
  --template-file cosmosdb-template.json
```

## Alternative: Skip Azure Cosmos DB for Now

If you're just getting started, you can use **local MongoDB** or **MongoDB Atlas** instead:

### Use Local MongoDB
```bash
# Install MongoDB locally
# Then update .env:
MONGODB_URI=mongodb://localhost:27017/second-chances
```

### Use MongoDB Atlas (Free, No Credit Card)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Get connection string
4. Update `.env` file

See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for details.

## Still Having Issues?

1. **Check Browser Console:**
   - Press F12 to open Developer Tools
   - Check Console tab for errors
   - Check Network tab for failed requests

2. **Contact Azure Support:**
   - If you have a support plan, create a support ticket
   - Or use Azure Community Forums

3. **Try Later:**
   - Azure Portal sometimes has temporary issues
   - Try again in a few hours

## Quick Checklist

Before creating Cosmos DB, ensure:
- [ ] You're logged into Azure Portal
- [ ] You have an active subscription
- [ ] Browser is up to date
- [ ] No ad blockers interfering
- [ ] Account name is unique and valid (lowercase, alphanumeric)
- [ ] All required fields are filled
- [ ] You've selected a valid region

## Recommended Approach

**For Development:**
1. Use **Local MongoDB** or **MongoDB Atlas** (easier, no portal issues)
2. Set up Azure resources later when ready to deploy

**For Production:**
1. Use **Azure CLI** to create resources (more reliable than portal)
2. Or use **Azure Resource Manager templates**

