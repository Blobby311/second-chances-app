# API Endpoints Summary

This document provides a quick reference for all API endpoints aligned with the frontend requirements.

## Base URL
`http://localhost:3000/api`

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register
- **POST** `/auth/register`
- Body: `{ name, email, password, role, referralCode? }`
- Returns: `{ token, user }`

### Login
- **POST** `/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Logout
- **POST** `/auth/logout`
- Returns: `{ message }`

---

## User Endpoints

### Get Profile
- **GET** `/user/profile`
- Returns: User object

### Update Profile
- **PUT** `/user/profile`
- Body: `{ name?, phone?, location? }`

### Upload Avatar
- **POST** `/user/avatar`
- FormData: `avatar` (file)
- Returns: `{ avatar }`

### Update Settings
- **PUT** `/user/settings`
- Body: `{ emailNotifications?, pushNotifications?, language?, theme? }`

### Get Referral Code
- **GET** `/user/referral-code`
- Returns: `{ referralCode }`

### Get Referral Stats
- **GET** `/user/referrals/stats`
- Returns: `{ totalReferred }`

### Delete Account
- **DELETE** `/user/account`

---

## Product Endpoints

### Browse Products
- **GET** `/products?filter={all|free|veg|fruit}&search={query}`
- Returns: Array of products

### Get Nearby Products
- **GET** `/products/nearby?lat={lat}&lng={lng}&radius={km}`
- Returns: Array of products

### Get Product Details
- **GET** `/products/:id`
- Returns: Product object

### Create Product (Seller)
- **POST** `/products`
- FormData: `image` (file), `name`, `description`, `category`, `price`, `deliveryMethod`, etc.
- Returns: Product object

### Update Product (Seller)
- **PUT** `/products/:id`
- FormData: `image?` (file), other fields
- Returns: Updated product

### Delete Product (Seller)
- **DELETE** `/products/:id`

---

## Seller Endpoints

### Get Stock
- **GET** `/seller/stock?status={to-ship|delivered|cancelled}`
- Returns: Array of products

### Get Orders
- **GET** `/seller/orders?status={status}`
- Returns: Array of orders

### Get Earnings
- **GET** `/seller/earnings`
- Returns: `{ totalEarnings, totalOrders, monthlyEarnings }`

### Get Stats
- **GET** `/seller/stats`
- Returns: `{ activeListings, trustScore, totalOrders, pendingOrders, completedOrders, itemsSold }`

### Get Alerts
- **GET** `/seller/alerts`
- Returns: `{ lowStock, lowStockCount, pendingShipments }`

### Get Recent Sales
- **GET** `/seller/recent-sales`
- Returns: Array of recent orders

---

## Order Endpoints

### Create Order
- **POST** `/orders`
- Body: `{ productId, paymentMethod, pointsToUse?, rewardId?, addressId? }`
- Returns: Order object

### Get Order Details
- **GET** `/orders/:id`
- Returns: Order object

### Update Order Status (Seller)
- **PUT** `/orders/:id/status`
- Body: `{ status }`
- Returns: Updated order

### Get Buyer Orders
- **GET** `/orders/buyer/orders?status={to-receive|completed|cancelled}`
- Returns: Array of orders

---

## Favorites Endpoints

### Get Favorites
- **GET** `/user/favorites`
- Returns: Array of products

### Add to Favorites
- **POST** `/user/favorites/:productId`
- Returns: `{ message }`

### Remove from Favorites
- **DELETE** `/user/favorites/:productId`

---

## Address Endpoints

### Get Addresses
- **GET** `/user/addresses`
- Returns: Array of addresses

### Add Address
- **POST** `/user/addresses`
- Body: `{ label, address, city, state, postalCode, isDefault? }`
- Returns: Address object

### Update Address
- **PUT** `/user/addresses/:id`
- Body: Address fields

### Set Default Address
- **PUT** `/user/addresses/:id/default`
- Returns: Updated address

### Delete Address
- **DELETE** `/user/addresses/:id`

---

## Payment Method Endpoints

### Get Payment Methods
- **GET** `/user/payment-methods`
- Returns: Array of payment methods

### Add Payment Method
- **POST** `/user/payment-methods`
- Body: `{ type, label, isDefault? }`
- Returns: Payment method object

### Set Default Payment Method
- **PUT** `/user/payment-methods/:id/default`
- Returns: Updated payment method

### Delete Payment Method
- **DELETE** `/user/payment-methods/:id`

### Process Payment
- **POST** `/user/payment-methods/process`
- Returns: `{ success, transactionId }`

---

## Rating Endpoints

### Submit Rating
- **POST** `/ratings`
- Body: `{ orderId, stars, experience, foodQuality, pickupEase, feedback? }`
- Returns: Rating object

### Get Seller Reviews
- **GET** `/ratings/sellers/:id/reviews`
- Returns: Array of reviews

### Get Buyer Reviews
- **GET** `/ratings/buyers/:id/reviews`
- Returns: Array of reviews

---

## Points Endpoints

### Get Points Balance
- **GET** `/user/points`
- Returns: `{ balance, transactions }`

### Earn Points
- **POST** `/user/points/earn`
- Body: `{ amount, source, description }`
- Returns: Transaction object

### Deduct Points
- **PUT** `/user/points/deduct`
- Body: `{ amount, description }`
- Returns: Transaction object

---

## Badge Endpoints

### Get User Badges
- **GET** `/user/badges`
- Returns: Array of user badges with progress

### Claim Badge
- **POST** `/user/badges/:id/claim`
- Returns: Updated user badge

---

## Mission Endpoints

### Get Daily Missions
- **GET** `/missions/daily`
- Returns: Array of missions with progress

### Get Weekly Missions
- **GET** `/missions/weekly`
- Returns: Array of missions with progress

### Claim Mission Points
- **POST** `/missions/:id/claim`
- Returns: `{ message, points }`

---

## Reward Endpoints

### Get Available Rewards
- **GET** `/rewards/available`
- Returns: Array of rewards

### Redeem Reward
- **POST** `/rewards/:id/redeem`
- Returns: `{ message, reward }`

---

## Chat Endpoints

### Get Chat List
- **GET** `/chats?role={buyer|seller}`
- Returns: Array of chats

### Get Messages
- **GET** `/chats/:id/messages`
- Returns: Array of messages

### Send Message
- **POST** `/chats/:id/messages`
- Body: `{ content }`
- Returns: Message object

### Delete Chat
- **DELETE** `/chats/:id`

---

## Notification Endpoints

### Get Notifications
- **GET** `/notifications`
- Returns: Array of notifications

### Mark as Read
- **PUT** `/notifications/:id/read`
- Returns: Updated notification

### Clear All
- **DELETE** `/notifications`

---

## Profile Endpoints

### Get Seller Profile
- **GET** `/sellers/:id`
- Returns: Seller profile with stats, badges, reviews

### Get Buyer Profile
- **GET** `/buyers/:id`
- Returns: Buyer profile with stats, badges, reviews

---

## Guide Endpoints

### Get Guides
- **GET** `/guides?category={category}`
- Returns: Array of guides

### Get Guide Details
- **GET** `/guides/:id`
- Returns: Guide object

---

## AI Endpoints

### AI Chat
- **POST** `/ai/chat`
- Body: `{ message, context? }`
- Returns: `{ response }`

### Get Chat History
- **GET** `/ai/chat/history`
- Returns: Array of chat messages

### Food Assistant
- **POST** `/ai/food-assistant`
- Body: `{ question }`
- Returns: `{ response, recentPurchases }`

### Get Recent Purchases
- **GET** `/ai/buyer/recent-purchases`
- Returns: Array of recent orders

---

## Referral Endpoints

### Apply Referral Code
- **POST** `/referrals/apply`
- Body: `{ referralCode, userId }`
- Returns: `{ message }`

---

## WebSocket Events

Connect to: `ws://localhost:3000`

### Events:
- `join-chat` - Join a chat room
- `send-message` - Send a message
- `new-message` - Receive new messages (broadcast)

---

## Response Formats

### Success Response
```json
{
  "data": {...}
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

### Validation Error
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

---

## Notes

1. All timestamps are in ISO 8601 format
2. File uploads use `multipart/form-data`
3. Points: 1 point = RM 0.01
4. Product status: `to-ship` = available for buyers
5. Order status mapping:
   - Frontend `to-receive` = Backend `['pending', 'ready-for-pickup', 'on-the-way', 'delivered']`
   - Frontend `completed` = Backend `completed`
   - Frontend `cancelled` = Backend `cancelled`

