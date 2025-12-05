# Second Chances Backend API

Backend API for the Second Chances food rescue marketplace application.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Profile management, settings, referrals
- **Product Management**: CRUD operations for sellers, browse/search for buyers
- **Order Management**: Order creation, status updates, order history
- **Chat System**: Real-time messaging with WebSocket support
- **Rewards & Points**: Points system, badges, missions, rewards redemption
- **Ratings & Reviews**: Rating system for buyers and sellers
- **Notifications**: Real-time notifications for various events
- **AI Assistant**: Placeholder for AI integration (food assistant, plant care)
- **File Uploads**: Image upload support for products and avatars

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads
- **Express Validator** for request validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local, MongoDB Atlas, or Azure Cosmos DB)
- npm or yarn

**Note:** For local development, you can use:
- Local MongoDB installation (free, no account needed)
- MongoDB Atlas free tier (512MB, no credit card required)
- Azure Cosmos DB free tier (25GB, account verification may be needed)

**⚠️ Student Subscription Note:** 
- **Azure for Students Starter** does NOT support Cosmos DB
- Use Local MongoDB or MongoDB Atlas for development instead
- See [STUDENT_SUBSCRIPTION_GUIDE.md](./STUDENT_SUBSCRIPTION_GUIDE.md) for details

See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for detailed setup options.

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/second-chances
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   CORS_ORIGIN=http://localhost:8081
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system or update `MONGODB_URI` to point to your MongoDB instance.

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the server:**
   ```bash
   # Production
   npm start

   # Development (with auto-reload)
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/avatar` - Upload avatar
- `PUT /api/user/settings` - Update settings
- `GET /api/user/referral-code` - Get referral code
- `GET /api/user/referrals/stats` - Get referral statistics
- `DELETE /api/user/account` - Delete account

### Products
- `GET /api/products` - Browse products (with filters)
- `GET /api/products/nearby` - Get nearby products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Seller
- `GET /api/seller/stock` - Get seller's stock
- `GET /api/seller/orders` - Get seller's orders
- `GET /api/seller/earnings` - Get earnings data
- `GET /api/seller/stats` - Get dashboard statistics
- `GET /api/seller/alerts` - Get alerts
- `GET /api/seller/recent-sales` - Get recent sales

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (seller only)
- `GET /api/orders/buyer/orders` - Get buyer's orders

### Favorites
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/favorites/:productId` - Add to favorites
- `DELETE /api/user/favorites/:productId` - Remove from favorites

### Addresses
- `GET /api/user/addresses` - Get addresses
- `POST /api/user/addresses` - Add address
- `PUT /api/user/addresses/:id` - Update address
- `PUT /api/user/addresses/:id/default` - Set default address
- `DELETE /api/user/addresses/:id` - Delete address

### Payment Methods
- `GET /api/user/payment-methods` - Get payment methods
- `POST /api/user/payment-methods` - Add payment method
- `PUT /api/user/payment-methods/:id/default` - Set default
- `DELETE /api/user/payment-methods/:id` - Delete payment method
- `POST /api/user/payment-methods/process` - Process payment

### Ratings
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/sellers/:id/reviews` - Get seller reviews
- `GET /api/ratings/buyers/:id/reviews` - Get buyer reviews

### Points
- `GET /api/user/points` - Get points balance
- `POST /api/user/points/earn` - Earn points
- `PUT /api/user/points/deduct` - Deduct points

### Badges
- `GET /api/user/badges` - Get user badges
- `POST /api/user/badges/:id/claim` - Claim badge

### Missions
- `GET /api/missions/daily` - Get daily missions
- `GET /api/missions/weekly` - Get weekly missions
- `POST /api/missions/:id/claim` - Claim mission points

### Rewards
- `GET /api/rewards/available` - Get available rewards
- `POST /api/rewards/:id/redeem` - Redeem reward

### Chat
- `GET /api/chats` - Get chat list
- `GET /api/chats/:id/messages` - Get messages
- `POST /api/chats/:id/messages` - Send message
- `DELETE /api/chats/:id` - Delete chat

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications` - Clear all

### Profiles
- `GET /api/sellers/:id` - Get seller profile
- `GET /api/buyers/:id` - Get buyer profile

### Guides
- `GET /api/guides` - Get guides
- `GET /api/guides/:id` - Get guide details

### AI
- `POST /api/ai/chat` - AI chat
- `GET /api/ai/chat/history` - Get chat history
- `POST /api/ai/food-assistant` - Food assistant
- `GET /api/ai/buyer/recent-purchases` - Get recent purchases

### Referrals
- `POST /api/referrals/apply` - Apply referral code

## WebSocket Events

The server supports real-time chat via Socket.io:

- **Connection**: Clients connect to the server
- **join-chat**: Join a chat room
- **send-message**: Send a message in a chat
- **new-message**: Receive new messages (broadcast)

## Database Models

- **User**: User accounts with roles (buyer/seller)
- **Product**: Products/blindboxes
- **Order**: Orders
- **Rating**: Ratings and reviews
- **Chat/Message**: Chat conversations
- **Favorite**: User favorites
- **Address**: User addresses
- **PaymentMethod**: Payment methods
- **PointsTransaction**: Points transactions
- **Badge/UserBadge**: Badges system
- **Mission/UserMission**: Missions system
- **Reward**: Rewards for redemption
- **Notification**: Notifications
- **Guide**: Educational guides

## File Uploads

Uploaded files are stored in the `uploads/` directory (configurable via `UPLOAD_DIR` env variable).

- Product images: `/uploads/product-{timestamp}.{ext}`
- User avatars: `/uploads/avatar-{timestamp}.{ext}`

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message"
}
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `ts-node-dev` for hot-reloading.

### Building for Production

```bash
npm run build
npm start
```

## Azure Deployment

This backend is configured for Azure App Service deployment. See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Azure Setup:

1. Create Azure Cosmos DB (MongoDB API)
2. Create Azure App Service
3. Configure environment variables in App Service settings
4. Deploy code via ZIP, Git, or Azure CLI
5. Enable WebSockets in App Service settings

### Azure-Specific Features:

- Automatic Azure environment detection
- Azure Cosmos DB connection string support
- Azure App Service file upload paths
- WebSocket support for real-time chat
- Health check endpoint for Azure monitoring

## Notes

1. **AI Integration**: The AI endpoints are placeholders. Integrate with your preferred AI service (OpenAI, etc.)

2. **Payment Processing**: The payment processing endpoint is a placeholder. Integrate with a payment gateway (Stripe, Razorpay, etc.)

3. **Image Storage**: 
   - Local development: Uses local file storage
   - Azure: Uses App Service file system (ephemeral)
   - Production: Consider using Azure Blob Storage for persistent storage

4. **Badge System**: Badge progress calculation needs to be implemented based on user actions (orders, ratings, etc.)

5. **Mission Progress**: Mission progress tracking needs to be implemented based on user actions

6. **Notifications**: Auto-generation of notifications for events (order updates, badge earned, etc.) needs to be implemented

## Frontend Integration

The frontend should:
1. Set the base URL to `http://localhost:3000/api` (or your server URL)
2. Include JWT token in Authorization header for authenticated requests
3. Connect to WebSocket at `ws://localhost:3000` for real-time chat

## License

ISC

