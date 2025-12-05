/**
 * Azure-specific configuration helpers
 */

export const getMongoConnectionString = (): string => {
  // Azure Cosmos DB with MongoDB API connection string format:
  // mongodb://<username>:<password>@<account>.mongo.cosmos.azure.com:10255/<database>?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<account>@
  
  // Or use Azure App Service connection string format
  const mongoUri = process.env.MONGODB_URI || process.env.CUSTOMCONNSTR_MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MongoDB connection string not found. Set MONGODB_URI or CUSTOMCONNSTR_MONGODB_URI');
  }
  
  return mongoUri;
};

export const getUploadDir = (): string => {
  // Azure App Service uses D:\home for persistent storage
  // Use D:\home\site\wwwroot\uploads for file uploads
  if (process.env.WEBSITE_INSTANCE_ID) {
    // Running on Azure
    return process.env.UPLOAD_DIR || 'D:\\home\\site\\wwwroot\\uploads';
  }
  // Local development
  return process.env.UPLOAD_DIR || './uploads';
};

export const getPort = (): number => {
  // Azure App Service sets PORT automatically
  return parseInt(process.env.PORT || process.env.WEBSITE_PORT || '3000', 10);
};

export const isAzureEnvironment = (): boolean => {
  return !!process.env.WEBSITE_INSTANCE_ID || !!process.env.WEBSITE_SITE_NAME;
};

