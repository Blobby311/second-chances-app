# Second Chances App - Complete Flow Documentation

## Table of Contents
1. [Seller Flow Diagram](#seller-flow-diagram)
2. [Seller Flow Details](#seller-flow-details)
3. [Buyer Flow Diagram](#buyer-flow-diagram)
4. [Buyer Flow Details](#buyer-flow-details)
5. [API Integration Points](#api-integration-points)
6. [Shared Screens](#shared-screens)

---

## Seller Flow Diagram

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Role Selection  │
│  (Tap Seller)   │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                        DASHBOARD                              │
│  (Main Hub - Cannot go back to login)                        │
│  • Total Earnings Graph                                      │
│  • Active Listings & Trust Score                             │
│  • Quick Stats (Orders, Pending, Completed)                  │
│  • Alerts (Low Stock, Pending Shipments)                     │
│  • Recent Sales List                                         │
└───┬──────────────────────────────────────────────────────────┘
    │
    │ [Swipe Right or Tap Menu Icon]
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│                      MENU - "The Giver"                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. Create New      → Create Blindbox               │    │
│  │  2. Stock           → Inventory Management          │    │
│  │  3. Orders          → Order Management              │    │
│  │  4. EduHub          → Educational Guides            │    │
│  │  5. Achievements    → Badges & Rewards              │    │
│  │  6. Notifications   → Notification Center           │    │
│  └─────────────────────────────────────────────────────┘    │
│  Bottom Icons: [Settings] [Chat]                             │
└──────────────────────────────────────────────────────────────┘
    │
    ├─[1]──▶ CREATE NEW BLINDBOX
    │         ├─ Upload Image
    │         ├─ Enter Name & Description
    │         ├─ Select Category (Fruits/Veg/Mix)
    │         ├─ Set Price (Free/RM5/RM10/Custom)
    │         ├─ Choose Delivery Method
    │         └─ [GENERATE] → Back to Dashboard
    │
    ├─[2]──▶ STOCK MANAGEMENT
    │         ├─ Tabs: [To Ship] [Delivered] [Cancelled]
    │         ├─ Product List with Images
    │         ├─ [Edit Icon] → EDIT STOCK SCREEN
    │         │                 └─ Update product → Save → Back
    │         └─ [Delete Icon] → Confirmation → Delete
    │
    ├─[3]──▶ ORDERS
    │         ├─ Tabs: [To Ship] [Delivered] [Cancelled]
    │         ├─ Order Cards with Status Indicators
    │         └─ Tap Order → ORDER DETAIL
    │                        ├─ View order info
    │                        └─ Update status
    │
    ├─[4]──▶ EDUHUB
    │         ├─ Categories: Vegetables, Fruits, Packaging, Business
    │         ├─ Guide Cards
    │         └─ Tap Guide → GUIDE DETAIL
    │                        └─ Read educational content
    │
    ├─[5]──▶ ACHIEVEMENTS & BADGES
    │         ├─ Badge Collection
    │         ├─ Progress Tracking
    │         └─ Badge Images Display
    │
    ├─[6]──▶ NOTIFICATIONS
    │         ├─ Unread Section (with red dots)
    │         ├─ Read Section
    │         ├─ Tap Notification:
    │         │   ├─ Order → Order Detail
    │         │   ├─ Product → Stock
    │         │   └─ Buyer → Buyer Profile
    │         └─ [Clear All] Button
    │
    ├─[Settings]──▶ SETTINGS
    │                ├─ Profile Overview (Uncle Roger)
    │                ├─ Edit Profile → EDIT PROFILE SCREEN
    │                ├─ Account Settings (Password, Notifications)
    │                ├─ Switch Role → BUYER HOME
    │                ├─ Language, Theme, Version
    │                ├─ [Log Out] → Login Screen
    │                └─ [Delete Account] → Confirmation
    │
    └─[Chat]──▶ CHAT LIST (Seller View)
                ├─ Shows: Buyers (Ahmad, Siti, Lim, Raj)
                ├─ Search & Filter (All/Unread)
                ├─ Swipe to Delete
                └─ Tap Chat → INDIVIDUAL CHAT
                             ├─ Message bubbles
                             ├─ Quick replies
                             └─ Send messages
```

**Additional Seller Features:**
- **AI Chatbot**: Plant care assistant (accessible from menu)
- **Browsing**: View marketplace as a buyer would see it

---

## Seller Flow Details

### 1. Login & Role Selection
- **Screen**: `app/login.tsx` → `app/role-selection.tsx`
- **Flow**: User logs in → Selects "Seller" role
- **Navigation**: → `/(seller)/dashboard`
- **API Needed**:
  - Login authentication
  - Role selection/assignment

### 2. Dashboard (Home Screen for Sellers)
- **Screen**: `app/(seller)/dashboard.tsx`
- **Features**:
  - Total earnings display with graph
  - Active listings count
  - Trust score (rating)
  - Quick stats (Total orders, Pending, Completed, Items sold)
  - Alerts (low stock, pending shipments)
  - Recent sales list
- **Navigation**:
  - Swipe right → Menu
  - Tap menu icon → Menu
  - Tap sale item → Order detail
- **API Needed**:
  - `GET /seller/earnings` - Total earnings data
  - `GET /seller/stats` - Active listings, trust score, order counts
  - `GET /seller/alerts` - Low stock alerts, pending shipments
  - `GET /seller/recent-sales` - Recent sales with product images

### 3. Menu (Main Navigation)
- **Screen**: `app/(seller)/menu.tsx`
- **Menu Items**:
  1. Create New → `/(seller)/create-new`
  2. Stock → `/(seller)/stock`
  3. Orders → `/(seller)/orders`
  4. EduHub → `/(seller)/eduhub`
  5. Achievements & Badges → `/(seller)/rewards`
  6. Notifications → `/(seller)/notifications`
- **Bottom Icons**:
  - Settings → `/(seller)/settings`
  - Chat → `/chat?role=seller`
- **Header**: Shows "The Giver" (centered)

### 4. Create New Blindbox
- **Screen**: `app/(seller)/create-new.tsx`
- **Features**:
  - Image upload
  - Blindbox name input
  - Description input
  - Category selection (Fruits, Vegetable, Mix)
  - Price selection (Free, RM5, RM10, Custom)
  - Delivery method (Doorstep, Hub Collect, Self Pick-Up)
  - Generate button
- **Navigation**: Swipe right → Menu
- **API Needed**:
  - `POST /products` - Create new blindbox with image upload
  - Image upload endpoint for blindbox photos

### 5. Stock Management
- **Screen**: `app/(seller)/stock.tsx`
- **Features**:
  - Three tabs: To Ship, Delivered, Cancelled
  - Product list with images, category, price, delivery method, best before date
  - Edit and Delete buttons for each item
- **Navigation**:
  - Edit icon → `/(seller)/edit-stock/[id]`
  - Delete icon → Delete confirmation
  - Swipe right → Menu
- **API Needed**:
  - `GET /seller/stock?status={to-ship|delivered|cancelled}` - Get stock by status
  - `DELETE /products/{id}` - Delete product

### 6. Edit Stock
- **Screen**: `app/(seller)/edit-stock/[id].tsx`
- **Features**: Edit existing blindbox details
- **API Needed**:
  - `GET /products/{id}` - Get product details
  - `PUT /products/{id}` - Update product

### 7. Orders Management
- **Screen**: `app/(seller)/orders.tsx`
- **Features**:
  - Three tabs: To Ship, Delivered, Cancelled
  - Order cards with product image, order ID, delivery method, total
  - Status indicators (checkmark for delivered, X for cancelled)
- **Navigation**:
  - Tap order → `/(seller)/order-detail/[id]`
  - Swipe right → Menu
- **API Needed**:
  - `GET /seller/orders?status={to-ship|delivered|cancelled}` - Get orders by status

### 8. Order Detail (Seller)
- **Screen**: `app/(seller)/order-detail/[id].tsx`
- **Features**: View detailed order information
- **API Needed**:
  - `GET /orders/{id}` - Get order details
  - `PUT /orders/{id}/status` - Update order status

### 9. EduHub
- **Screen**: `app/(seller)/eduhub.tsx`
- **Features**:
  - Educational guides for sellers
  - Categories: Vegetables, Fruits, Packaging, Business
  - Guide cards with images
- **Navigation**:
  - Tap guide → `/(seller)/guide/[id]`
  - Swipe right → Menu
- **API Needed**:
  - `GET /guides?category={vegetables|fruits|packaging|business}` - Get educational content

### 10. Guide Detail
- **Screen**: `app/(seller)/guide/[id].tsx`
- **Features**: View detailed guide content
- **API Needed**:
  - `GET /guides/{id}` - Get guide content

### 11. Achievements & Badges
- **Screen**: `app/(seller)/rewards.tsx`
- **Features**:
  - Badge collection with progress tracking
  - Earned badges have thicker borders
  - Badge images from assets
- **Navigation**: Swipe right → Menu
- **API Needed**:
  - `GET /seller/badges` - Get badges with progress
  - `POST /seller/badges/{id}/claim` - Claim earned badges

### 12. Notifications (Seller)
- **Screen**: `app/(seller)/notifications.tsx`
- **Features**:
  - Unread and Read sections
  - Notification types: orders, products, buyers
  - Circular images with unread indicators
  - Clear All button
- **Navigation**:
  - Order notification → `/(seller)/order-detail/[id]`
  - Product notification → `/(seller)/stock`
  - Buyer notification → `/buyer-profile/[id]`
  - Swipe right → Menu
- **API Needed**:
  - `GET /notifications` - Get all notifications
  - `PUT /notifications/{id}/read` - Mark as read
  - `DELETE /notifications` - Clear all

### 13. Settings (Seller)
- **Screen**: `app/(seller)/settings.tsx`
- **Features**:
  - User profile with avatar (Uncle Roger)
  - Edit profile button
  - Account section (Change password, Email/Push notifications)
  - Switch Role (Seller/Buyer toggle)
  - Language, Theme, Version
  - Log Out button
  - Delete Account button
- **Navigation**:
  - Edit icon → `/(seller)/edit-profile`
  - Switch to Buyer → `/(buyer)/home`
  - Log Out → `/login`
- **API Needed**:
  - `GET /user/profile` - Get user data
  - `PUT /user/settings` - Update notification preferences
  - `POST /auth/logout` - Logout
  - `DELETE /user/account` - Delete account

### 14. Edit Profile (Seller)
- **Screen**: `app/(seller)/edit-profile.tsx`
- **Features**: Edit name, email, phone, avatar
- **API Needed**:
  - `GET /user/profile` - Get current profile
  - `PUT /user/profile` - Update profile
  - `POST /user/avatar` - Upload avatar image

### 15. AI Chatbot
- **Screen**: `app/(seller)/ai-chatbot.tsx`
- **Features**:
  - AI assistant for plant care tips
  - Message history
  - Quick replies
- **API Needed**:
  - `POST /ai/chat` - Send message and get AI response
  - `GET /ai/chat/history` - Get chat history

### 16. Browsing (Seller Views Buyer Products)
- **Screen**: `app/(seller)/browsing.tsx`
- **Features**: View what buyers might be looking for
- **API Needed**:
  - `GET /products/browse` - Get marketplace products

---

## Buyer Flow Diagram

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Role Selection  │
│  (Tap Buyer)    │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    HOME / BROWSE SCREEN                       │
│  (Main Hub - Cannot go back to login)                        │
│  • Search Bar                                                │
│  • Filter Chips (All, Free Gifts, Veg, Fruit)               │
│  • Product Grid (2 columns)                                  │
│  • Heart Icons to Favorite                                   │
│  • Verified Badges & FREE Tags                               │
└───┬──────────────────────────────────────────────────────────┘
    │
    │ [Swipe Right or Tap Menu Icon]
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│                   MENU - "The Gatherer"                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. My Orders       → Order History & Rating        │    │
│  │  2. Favorites       → Favorited Products            │    │
│  │  3. Map             → Nearby Products Map           │    │
│  │  4. Learn           → AI Food Assistant             │    │
│  │  5. Rewards         → Badges, Missions, Redeem      │    │
│  │  6. Notifications   → Notification Center           │    │
│  └─────────────────────────────────────────────────────┘    │
│  Bottom Icons: [Settings] [Chat]                             │
└──────────────────────────────────────────────────────────────┘
    │
    ├─[Home]──▶ PRODUCT DETAIL
    │           ├─ Hero Image with Favorite Heart
    │           ├─ Product Info & Price
    │           ├─ Likely to Contain Items
    │           ├─ Imperfect Meter
    │           ├─ Seller Profile Card (Clickable)
    │           │   ├─ Avatar, Name, Rating
    │           │   └─ Seller Badges
    │           └─ [Rescue This Box] → CHECKOUT
    │                                   ├─ Order Summary
    │                                   ├─ Payment Method Selection
    │                                   ├─ Rewards & Points Section
    │                                   │   ├─ Use Reward (Free Delivery, Discounts)
    │                                   │   └─ Use Points Toggle
    │                                   ├─ Total Calculation
    │                                   └─ [Secure Payment] → Success Alert → CHAT
    │
    ├─[1]──▶ MY ORDERS
    │         ├─ Tabs: [To Receive] [Completed] [Cancelled]
    │         ├─ Order Cards with Product Images
    │         ├─ [Contact Seller] → CHAT with Seller
    │         ├─ [Rate Seller] → RATING SCREEN
    │         │                   ├─ 5-Star Rating
    │         │                   ├─ Experience Emoji Selector
    │         │                   ├─ Food Quality Slider
    │         │                   ├─ Pickup Ease Slider
    │         │                   ├─ Feedback Text
    │         │                   └─ [Submit & Earn Points] → Home
    │         └─ Tap Order → ORDER DETAIL
    │
    ├─[2]──▶ FAVORITES
    │         ├─ Search Bar
    │         ├─ Filtered Product Grid (favorited only)
    │         ├─ Heart Icons to Unfavorite
    │         ├─ Empty State (when no favorites)
    │         └─ Tap Product → PRODUCT DETAIL
    │
    ├─[3]──▶ MAP
    │         └─ Coming Soon (Map view of nearby products)
    │
    ├─[4]──▶ LEARN (AI Food Assistant)
    │         ├─ Welcome Screen:
    │         │   ├─ AI Bot Icon (80x80, green border)
    │         │   ├─ Recent Purchases Context Card
    │         │   └─ Suggestion Pills (Storage, Recipes, Seasonal, Nutrition)
    │         ├─ Chat Interface:
    │         │   ├─ AI Messages (beige bubbles with bot avatar)
    │         │   ├─ User Messages (terracotta bubbles)
    │         │   └─ Context Banner (shows what purchases AI considers)
    │         └─ Input Box (tap suggestion → fills input)
    │
    ├─[5]──▶ REWARDS & BADGES
    │         ├─ Total Points Display (always visible)
    │         ├─ Three Tabs:
    │         │   ├─ [Badges]: Collection with progress bars
    │         │   ├─ [Missions]: Daily & Weekly with Claim buttons
    │         │   └─ [Redeem]: Rewards to exchange for points
    │         └─ Badge images from assets folder
    │
    ├─[6]──▶ NOTIFICATIONS
    │         ├─ Unread Section
    │         ├─ Read Section (70% opacity)
    │         ├─ Notification Types:
    │         │   ├─ Order → My Orders
    │         │   ├─ Product → Product Detail
    │         │   ├─ Favorite → Favorites
    │         │   └─ Reward → Rewards Page
    │         ├─ Images:
    │         │   ├─ Product photos
    │         │   ├─ Badge images (eco-hero.png, etc.)
    │         │   └─ Coins icon for points
    │         └─ [Clear All] Button
    │
    ├─[Settings]──▶ SETTINGS
    │                ├─ Profile Overview (ChuaWasHere)
    │                ├─ Account Section:
    │                │   ├─ Personal Details → EDIT PROFILE
    │                │   │                      ├─ Edit Name, Email, Phone
    │                │   │                      ├─ Change Photo
    │                │   │                      └─ [Save] → Back
    │                │   ├─ Addresses → ADDRESSES SCREEN
    │                │   │              ├─ Address List
    │                │   │              ├─ Default Address Indicator
    │                │   │              └─ [Add New Address]
    │                │   ├─ Payment Methods → PAYMENTS SCREEN
    │                │   │                    ├─ Card List
    │                │   │                    ├─ Default Indicator
    │                │   │                    └─ [Add Payment Method]
    │                │   └─ Change Password
    │                ├─ Notification Preferences (Toggles)
    │                ├─ Switch Role → SELLER DASHBOARD
    │                ├─ App Info (Version)
    │                ├─ [Log Out] → Login Screen
    │                └─ [Delete Account] → Confirmation
    │
    └─[Chat]──▶ CHAT LIST (Buyer View)
                ├─ Shows: Sellers (Uncle Roger, Kak Siti)
                ├─ Search & Filter (All/Unread)
                ├─ Order Tags
                ├─ Swipe to Delete
                └─ Tap Chat → INDIVIDUAL CHAT
                             ├─ Tap Header/Avatar → SELLER PROFILE
                             │                       ├─ Avatar, Name, Stats
                             │                       ├─ Badges Display
                             │                       ├─ Buyer Reviews
                             │                       └─ [Chat Button]
                             ├─ Message Bubbles
                             ├─ Quick Replies
                             └─ Send Messages
```

**Additional Seller Screens:**
- **AI Chatbot**: Plant care assistant (accessible from menu)
- **Browsing**: View marketplace as a buyer would see it

---

## Buyer Flow Diagram

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Role Selection  │
│  (Tap Buyer)    │
└──────┬──────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    HOME / BROWSE SCREEN                       │
│  (Main Hub - Cannot go back to login)                        │
│  • Search Bar                                                │
│  • Filter Chips (All, Free Gifts, Veg, Fruit)               │
│  • Product Grid (2 columns)                                  │
│  • Heart Icons to Favorite                                   │
│  • Verified Badges & FREE Tags                               │
└───┬──────────────────────────────────────────────────────────┘
    │
    │ [Swipe Right or Tap Menu Icon]
    │
    ▼
┌──────────────────────────────────────────────────────────────┐
│                   MENU - "The Gatherer"                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. My Orders       → Order History & Rating        │    │
│  │  2. Favorites       → Favorited Products            │    │
│  │  3. Map             → Nearby Products Map           │    │
│  │  4. Learn           → AI Food Assistant             │    │
│  │  5. Rewards         → Badges, Missions, Redeem      │    │
│  │  6. Notifications   → Notification Center           │    │
│  └─────────────────────────────────────────────────────┘    │
│  Bottom Icons: [Settings] [Chat]                             │
└──────────────────────────────────────────────────────────────┘
    │
    ├─[Home]──▶ PRODUCT DETAIL
    │           ├─ Hero Image with Favorite Heart
    │           ├─ Product Info & Price
    │           ├─ Likely to Contain Items
    │           ├─ Imperfect Meter
    │           ├─ Seller Profile Card (Clickable)
    │           │   ├─ Avatar, Name, Rating
    │           │   └─ Seller Badges
    │           └─ [Rescue This Box] → CHECKOUT
    │                                   ├─ Order Summary
    │                                   ├─ Payment Method Selection
    │                                   ├─ Rewards & Points Section
    │                                   │   ├─ Use Reward (Free Delivery, Discounts)
    │                                   │   └─ Use Points Toggle
    │                                   ├─ Total Calculation
    │                                   └─ [Secure Payment] → Success Alert → CHAT
    │
    ├─[1]──▶ MY ORDERS
    │         ├─ Tabs: [To Receive] [Completed] [Cancelled]
    │         ├─ Order Cards with Product Images
    │         ├─ [Contact Seller] → CHAT with Seller
    │         ├─ [Rate Seller] → RATING SCREEN
    │         │                   ├─ 5-Star Rating
    │         │                   ├─ Experience Emoji Selector
    │         │                   ├─ Food Quality Slider
    │         │                   ├─ Pickup Ease Slider
    │         │                   ├─ Feedback Text
    │         │                   └─ [Submit & Earn Points] → Home
    │         └─ Tap Order → ORDER DETAIL
    │
    ├─[2]──▶ FAVORITES
    │         ├─ Search Bar
    │         ├─ Filtered Product Grid (favorited only)
    │         ├─ Heart Icons to Unfavorite
    │         ├─ Empty State (when no favorites)
    │         └─ Tap Product → PRODUCT DETAIL
    │
    ├─[3]──▶ MAP
    │         └─ Coming Soon (Map view of nearby products)
    │
    ├─[4]──▶ LEARN (AI Food Assistant)
    │         ├─ Welcome Screen:
    │         │   ├─ AI Bot Icon (80x80, green border)
    │         │   ├─ Recent Purchases Context Card
    │         │   └─ Suggestion Pills (Storage, Recipes, Seasonal, Nutrition)
    │         ├─ Chat Interface:
    │         │   ├─ AI Messages (beige bubbles with bot avatar)
    │         │   ├─ User Messages (terracotta bubbles)
    │         │   └─ Context Banner (shows what purchases AI considers)
    │         └─ Input Box (tap suggestion → fills input)
    │
    ├─[5]──▶ REWARDS & BADGES
    │         ├─ Total Points Display (always visible)
    │         ├─ Three Tabs:
    │         │   ├─ [Badges]: Collection with progress bars
    │         │   ├─ [Missions]: Daily & Weekly with Claim buttons
    │         │   └─ [Redeem]: Rewards to exchange for points
    │         └─ Badge images from assets folder
    │
    ├─[6]──▶ NOTIFICATIONS
    │         ├─ Unread Section
    │         ├─ Read Section (70% opacity)
    │         ├─ Notification Types:
    │         │   ├─ Order → My Orders
    │         │   ├─ Product → Product Detail
    │         │   ├─ Favorite → Favorites
    │         │   └─ Reward → Rewards Page
    │         ├─ Images:
    │         │   ├─ Product photos
    │         │   ├─ Badge images (eco-hero.png, etc.)
    │         │   └─ Coins icon for points
    │         └─ [Clear All] Button
    │
    ├─[Settings]──▶ SETTINGS
    │                ├─ Profile Overview (ChuaWasHere)
    │                ├─ Account Section:
    │                │   ├─ Personal Details → EDIT PROFILE
    │                │   │                      ├─ Edit Name, Email, Phone
    │                │   │                      ├─ Change Photo
    │                │   │                      └─ [Save] → Back
    │                │   ├─ Addresses → ADDRESSES SCREEN
    │                │   │              ├─ Address List
    │                │   │              ├─ Default Address Indicator
    │                │   │              └─ [Add New Address]
    │                │   ├─ Payment Methods → PAYMENTS SCREEN
    │                │   │                    ├─ Card List
    │                │   │                    ├─ Default Indicator
    │                │   │                    └─ [Add Payment Method]
    │                │   └─ Change Password
    │                ├─ Notification Preferences (Toggles)
    │                ├─ Switch Role → SELLER DASHBOARD
    │                ├─ App Info (Version)
    │                ├─ [Log Out] → Login Screen
    │                └─ [Delete Account] → Confirmation
    │
    └─[Chat]──▶ CHAT LIST (Buyer View)
                ├─ Shows: Sellers (Uncle Roger, Kak Siti)
                ├─ Search & Filter (All/Unread)
                ├─ Order Tags
                ├─ Swipe to Delete
                └─ Tap Chat → INDIVIDUAL CHAT
                             ├─ Tap Header/Avatar → SELLER PROFILE
                             │                       ├─ Avatar, Name, Stats
                             │                       ├─ Badges Display
                             │                       ├─ Buyer Reviews
                             │                       └─ [Chat Button]
                             ├─ Message Bubbles
                             ├─ Quick Replies
                             └─ Send Messages
```

**Additional Buyer Screens:**
- **Referrals**: Share referral code, track referrals
- **Help**: Help topics and Contact Support
- **Profile**: Profile overview with stats (accessed from menu header)

---

## Buyer Flow Details

### 1. Login & Role Selection
- **Screen**: `app/login.tsx` → `app/role-selection.tsx`
- **Flow**: User logs in → Selects "Buyer" role
- **Navigation**: → `/(buyer)/home`
- **API Needed**:
  - Login authentication
  - Role selection/assignment

### 2. Home/Browse Screen
- **Screen**: `app/(buyer)/home.tsx`
- **Features**:
  - Search bar
  - Filter chips (All, Free Gifts, Veg, Fruit)
  - Product grid (2 columns) with images
  - Heart icon to favorite/unfavorite
  - Verified badges on products
  - FREE tags on community gifts
  - Distance display
- **Navigation**:
  - Swipe right → Menu
  - Tap product card → `/product/[id]`
  - Tap menu icon → `/(buyer)/menu`
  - Tap heart → Toggle favorite
- **API Needed**:
  - `GET /products?filter={all|free|veg|fruit}&search={query}` - Get available products
  - `GET /user/favorites` - Get favorited product IDs
  - `POST /user/favorites/{productId}` - Add to favorites
  - `DELETE /user/favorites/{productId}` - Remove from favorites

### 3. Menu (Main Navigation)
- **Screen**: `app/(buyer)/menu.tsx`
- **Menu Items**:
  1. My Orders → `/(buyer)/my-orders`
  2. Favorites → `/(buyer)/favorites`
  3. Map → `/(buyer)/map`
  4. Learn → `/(buyer)/learn`
  5. Rewards → `/(buyer)/rewards`
  6. Notifications → `/(buyer)/notifications`
- **Bottom Icons**:
  - Settings → `/(buyer)/settings`
  - Chat → `/chat?role=buyer`
- **Header**: Shows "The Gatherer" (centered)

### 4. Product Detail
- **Screen**: `app/product/[id].tsx`
- **Features**:
  - Hero image with back and favorite buttons
  - Product title, description, price
  - Verified Neighbor badge
  - "Likely to Contain" items with percentages
  - Imperfect Meter
  - Seller profile card (clickable) with:
    - Seller avatar, name, verified badge
    - Rating and boxes shared count
    - Seller badges (Community Giver, Eco Hero)
  - "Rescue This Box" button
- **Navigation**:
  - Back button → Previous screen
  - Tap heart → Toggle favorite
  - Tap seller card → `/seller-profile/{sellerId}`
  - Rescue button → `/checkout`
- **API Needed**:
  - `GET /products/{id}` - Get full product details
  - `GET /sellers/{sellerId}/preview` - Get seller info for product

### 5. Seller Profile
- **Screen**: `app/seller-profile/[id].tsx`
- **Features**:
  - Seller avatar, name, type
  - Verified seller badge
  - Stats (Boxes Shared, Rating, Reply Rate)
  - Badge images displayed
  - Buyer reviews list
  - Chat button
- **Navigation**:
  - Tap Chat button → `/chat/{sellerId}`
- **API Needed**:
  - `GET /sellers/{id}` - Get seller profile with stats, badges, reviews

### 6. Checkout
- **Screen**: `app/checkout.tsx`
- **Features**:
  - Order summary with product title and price
  - Payment method selection (GrabPay, TnG, FPX)
  - Rewards & Points section:
    - Available rewards (Free Delivery, 10% Discount)
    - Use Points toggle (1 point = RM0.01)
  - Total calculation with discounts
  - "Secure Payment" / "Confirm Claim" button
- **Navigation**:
  - After payment → Alert → Chat with seller
- **API Needed**:
  - `GET /user/rewards/available` - Get claimable rewards
  - `GET /user/points` - Get current points balance
  - `POST /orders` - Create new order
  - `POST /payments` - Process payment
  - `PUT /user/points/deduct` - Deduct used points
  - `PUT /user/rewards/{id}/use` - Use reward

### 7. My Orders
- **Screen**: `app/(buyer)/my-orders.tsx`
- **Features**:
  - Three tabs: To Receive, Completed, Cancelled
  - Order cards with product image, seller name, order ID, delivery method
  - Status indicators
  - Contact Seller button → Opens chat
  - Rate Seller button (only for completed orders not yet rated)
- **Navigation**:
  - Tap order → `/(buyer)/order-detail/[id]`
  - Contact Seller → `/chat/{sellerId}`
  - Rate Seller → `/rating/[orderId]`
- **API Needed**:
  - `GET /buyer/orders?status={to-receive|completed|cancelled}` - Get orders by status
  - `GET /orders/{id}` - Get order details

### 8. Order Detail (Buyer)
- **Screen**: `app/(buyer)/order-detail/[id].tsx`
- **Features**: View order details
- **API Needed**:
  - `GET /orders/{id}` - Get full order details

### 9. Rating Screen
- **Screen**: `app/rating/[orderId].tsx`
- **Features**:
  - Seller avatar and name
  - 5-star rating
  - The Exchange (Experience) - Emoji selector (Shy Seedling, Friendly Sprout, Jolly Pumpkin)
  - The Harvest (Food) - Slider (Wilted to Crisp)
  - Pickup Ease - Slider (Bumpy Path to Smooth Sailing)
  - Feedback text input
  - "Submit & Earn Points" button
- **Navigation**: After submit → `/(buyer)/home`
- **API Needed**:
  - `GET /orders/{orderId}` - Get order and seller info
  - `POST /ratings` - Submit rating with all data
  - `POST /user/points/earn` - Award points for rating

### 10. Favorites
- **Screen**: `app/(buyer)/favorites.tsx`
- **Features**:
  - Search bar
  - Product grid showing only favorited items
  - Heart icon to unfavorite
  - Empty state when no favorites
- **Navigation**:
  - Tap product → `/product/[id]`
  - Tap heart → Toggle favorite
- **API Needed**:
  - `GET /user/favorites` - Get favorited products with full details
  - `DELETE /user/favorites/{productId}` - Remove from favorites

### 11. Map
- **Screen**: `app/(buyer)/map.tsx`
- **Features**: Map view of nearby sellers and products (Coming Soon)
- **API Needed**:
  - `GET /products/nearby?lat={lat}&lng={lng}&radius={km}` - Get nearby products with coordinates

### 12. Learn (AI Food Assistant)
- **Screen**: `app/(buyer)/learn.tsx`
- **Features**:
  - Welcome screen with AI bot icon
  - Recent purchases context banner
  - Topic suggestion pills (Storage Tips, Recipe Ideas, Seasonal Guide, Nutrition Info)
  - AI chat interface
  - Message bubbles (bot in beige, user in terracotta)
- **Navigation**: Tap suggestion → Fills input box
- **API Needed**:
  - `GET /buyer/recent-purchases` - Get recent orders for context
  - `POST /ai/food-assistant` - Send question with purchase context, get AI response
  - `GET /ai/chat/history` - Get previous chat history

### 13. Rewards & Badges
- **Screen**: `app/(buyer)/rewards.tsx`
- **Features**:
  - Total points display (always visible)
  - Three tabs: Badges, Missions, Redeem
  - **Badges Tab**:
    - Progress stats (X/Y earned)
    - Badge grid with images from assets
    - Progress bars for unearned badges
  - **Missions Tab**:
    - Daily missions (Place order, Leave review, Browse products)
    - Weekly missions (Complete orders, Rescue boxes, Refer friend)
    - Progress bars and Claim buttons
  - **Redeem Tab**:
    - Available rewards list (Free Delivery, Discounts, Free boxes)
    - Redeem buttons
- **API Needed**:
  - `GET /user/points` - Get current points
  - `GET /user/badges` - Get badges with progress
  - `GET /missions/daily` - Get daily missions with progress
  - `GET /missions/weekly` - Get weekly missions with progress
  - `POST /missions/{id}/claim` - Claim mission points
  - `GET /rewards/available` - Get available rewards
  - `POST /rewards/{id}/redeem` - Redeem reward (deducts points)

### 14. Notifications (Buyer)
- **Screen**: `app/(buyer)/notifications.tsx`
- **Features**:
  - Unread and Read sections
  - Notification types: order, product, reward, favorite
  - Images:
    - Product images for order/product notifications
    - Badge images for badge earned notifications
    - Coins icon for points notifications
  - Clear All button
- **Navigation**:
  - Order notification → `/(buyer)/my-orders`
  - Product notification → `/product/[id]`
  - Favorite notification → `/(buyer)/favorites`
  - Reward notification → `/(buyer)/rewards`
- **API Needed**:
  - `GET /notifications` - Get all notifications
  - `PUT /notifications/{id}/read` - Mark as read
  - `DELETE /notifications` - Clear all

### 15. Settings (Buyer)
- **Screen**: `app/(buyer)/settings.tsx`
- **Features**:
  - User profile with avatar (ChuaWasHere)
  - Edit profile button
  - Account section:
    - Personal details
    - Addresses
    - Payment methods
    - Change password
  - Notification preferences (Order updates, Promotions, Community tips)
  - Switch Role (Seller/Buyer toggle)
  - App info with version
  - Log Out button
  - Delete Account button
- **Navigation**:
  - Personal details → `/(buyer)/edit-profile`
  - Addresses → `/(buyer)/addresses`
  - Payment methods → `/(buyer)/payments`
  - Switch to Seller → `/(seller)/dashboard`
  - Log Out → `/login`
- **API Needed**:
  - `GET /user/profile` - Get user data
  - `PUT /user/settings/notifications` - Update notification preferences
  - `POST /auth/logout` - Logout
  - `DELETE /user/account` - Delete account

### 16. Edit Profile (Buyer)
- **Screen**: `app/(buyer)/edit-profile.tsx`
- **Features**: Edit name, email, phone, avatar
- **API Needed**:
  - `GET /user/profile` - Get current profile
  - `PUT /user/profile` - Update profile
  - `POST /user/avatar` - Upload avatar image

### 17. Addresses
- **Screen**: `app/(buyer)/addresses.tsx`
- **Features**:
  - Address list with Home, Office, etc.
  - Default address indicator
  - Add New Address button
- **API Needed**:
  - `GET /user/addresses` - Get saved addresses
  - `POST /user/addresses` - Add new address
  - `PUT /user/addresses/{id}` - Update address
  - `PUT /user/addresses/{id}/default` - Set default address
  - `DELETE /user/addresses/{id}` - Delete address

### 18. Payment Methods
- **Screen**: `app/(buyer)/payments.tsx`
- **Features**:
  - Payment method list (cards)
  - Default payment indicator
  - Add Payment Method button
- **API Needed**:
  - `GET /user/payment-methods` - Get saved payment methods
  - `POST /user/payment-methods` - Add new payment method
  - `PUT /user/payment-methods/{id}/default` - Set default
  - `DELETE /user/payment-methods/{id}` - Delete payment method

### 19. Referrals
- **Screen**: `app/(buyer)/referrals.tsx`
- **Features**:
  - Referral code display
  - Share Code button (native share)
  - How It Works steps
  - Referral stats (total people referred)
- **API Needed**:
  - `GET /user/referral-code` - Get unique referral code
  - `GET /user/referrals/stats` - Get referral statistics

### 20. Help & Support
- **Screen**: `app/(buyer)/help.tsx`
- **Features**:
  - Help topics list (Orders, Payment, Delivery, Returns, Account, Support)
  - Contact Support button
- **API Needed**:
  - `GET /help/topics` - Get help articles
  - `POST /support/contact` - Submit support request

### 21. Profile Overview
- **Screen**: `app/(buyer)/profile.tsx`
- **Features**:
  - Profile card with avatar, name, email, location
  - Edit Profile button
  - Quick stats (Boxes rescued, Favorites, Avg. rating)
- **Navigation**: Edit Profile → `/(buyer)/edit-profile`
- **API Needed**:
  - `GET /user/profile` - Get profile with stats

---

## Shared Screens

### 1. Chat List
- **Screen**: `app/chat/index.tsx`
- **Features**:
  - Search bar
  - All/Unread tabs
  - Chat list with avatars, last message, timestamp
  - Swipe left to delete
  - Unread indicators (green dots)
  - **Role-based display**:
    - Buyer (role='buyer') → Shows chats with sellers (Uncle Roger, Kak Siti)
    - Seller (role='seller') → Shows chats with buyers (Ahmad, Siti, Lim, Raj)
- **Navigation**:
  - Tap chat → `/chat/[id]`
  - Menu icon → Returns to respective menu (buyer/seller)
- **API Needed**:
  - `GET /chats?role={buyer|seller}` - Get chat list based on user role
  - `DELETE /chats/{id}` - Delete conversation

### 2. Individual Chat
- **Screen**: `app/chat/[id].tsx`
- **Features**:
  - Clickable header (profile picture + name)
  - Online status indicator
  - Message bubbles (sender in terracotta, receiver in dark green)
  - Quick replies
  - Text input with Send button
  - **Role detection**: ID starting with 's' = buyer chatting with seller, 'b' = seller chatting with buyer
- **Navigation**:
  - Tap header (buyer only) → `/seller-profile/{id}`
  - Back button → Previous screen
- **API Needed**:
  - `GET /chats/{id}/messages` - Get message history
  - `POST /chats/{id}/messages` - Send new message
  - WebSocket connection for real-time messaging
  - `GET /users/{id}/online-status` - Get online status

### 3. Buyer Profile (Viewed by Seller)
- **Screen**: `app/buyer-profile/[id].tsx`
- **Features**:
  - Buyer avatar, name, customer type
  - Verified buyer badge
  - Stats (Orders Placed, Rating, Member Type)
  - Badge images
  - Seller reviews about this buyer
  - Chat button
- **Navigation**: Tap Chat → `/chat/{buyerId}`
- **API Needed**:
  - `GET /buyers/{id}` - Get buyer profile with stats, badges, reviews

---

## API Integration Points Summary

### Authentication & User Management
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `GET /user/profile` - Get current user profile
- `PUT /user/profile` - Update profile
- `POST /user/avatar` - Upload avatar
- `DELETE /user/account` - Delete account
- `PUT /user/settings` - Update app settings

### Products & Inventory (Seller)
- `POST /products` - Create new blindbox (with image upload)
- `GET /products/{id}` - Get product details
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /seller/stock?status={status}` - Get seller's inventory by status

### Products & Browse (Buyer)
- `GET /products?filter={filter}&search={query}` - Browse available products
- `GET /products/{id}` - Get product details
- `GET /products/nearby?lat={lat}&lng={lng}&radius={km}` - Get nearby products for map

### Orders
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order details
- `GET /seller/orders?status={status}` - Get seller's orders
- `GET /buyer/orders?status={status}` - Get buyer's orders
- `PUT /orders/{id}/status` - Update order status

### Favorites
- `GET /user/favorites` - Get favorited product IDs
- `POST /user/favorites/{productId}` - Add to favorites
- `DELETE /user/favorites/{productId}` - Remove from favorites

### Payments
- `POST /payments` - Process payment
- `GET /user/payment-methods` - Get saved payment methods
- `POST /user/payment-methods` - Add payment method
- `PUT /user/payment-methods/{id}/default` - Set default
- `DELETE /user/payment-methods/{id}` - Delete payment method

### Addresses
- `GET /user/addresses` - Get saved addresses
- `POST /user/addresses` - Add new address
- `PUT /user/addresses/{id}` - Update address
- `PUT /user/addresses/{id}/default` - Set default address
- `DELETE /user/addresses/{id}` - Delete address

### Rewards & Points
- `GET /user/points` - Get current points balance
- `POST /user/points/earn` - Award points (after rating, missions)
- `PUT /user/points/deduct` - Deduct points (checkout)
- `GET /rewards/available` - Get available rewards to redeem
- `POST /rewards/{id}/redeem` - Redeem reward for points

### Badges
- `GET /user/badges` - Get badges with progress (buyer or seller)
- `POST /user/badges/{id}/claim` - Claim earned badge

### Missions
- `GET /missions/daily` - Get daily missions with progress
- `GET /missions/weekly` - Get weekly missions with progress
- `POST /missions/{id}/claim` - Claim mission points

### Ratings & Reviews
- `POST /ratings` - Submit rating for seller/buyer
- `GET /sellers/{id}/reviews` - Get reviews for seller
- `GET /buyers/{id}/reviews` - Get reviews for buyer

### Chats
- `GET /chats?role={buyer|seller}` - Get chat list
- `GET /chats/{id}/messages` - Get message history
- `POST /chats/{id}/messages` - Send message
- `DELETE /chats/{id}` - Delete conversation
- WebSocket: `/ws/chat/{chatId}` - Real-time messaging

### Notifications
- `GET /notifications` - Get all notifications
- `PUT /notifications/{id}/read` - Mark as read
- `DELETE /notifications` - Clear all notifications

### Referrals
- `GET /user/referral-code` - Get unique referral code
- `GET /user/referrals/stats` - Get referral statistics
- `POST /referrals/apply` - Apply referral code on signup

### Educational Content
- `GET /guides?category={category}` - Get educational guides (seller/buyer)
- `GET /guides/{id}` - Get guide details

### AI Assistants
- `POST /ai/chat` - Send message to AI assistant
- `GET /ai/chat/history` - Get AI chat history
- Context data:
  - Seller AI: Plant care, growing tips
  - Buyer AI: Storage, recipes, nutrition (with recent purchases context)

### Analytics (Seller)
- `GET /seller/earnings` - Get earnings data with graph
- `GET /seller/stats` - Get dashboard statistics
- `GET /seller/alerts` - Get low stock/pending alerts

### Seller/Buyer Profiles
- `GET /sellers/{id}` - Get seller profile (viewed by buyer)
- `GET /buyers/{id}` - Get buyer profile (viewed by seller)

---

## Data Synchronization Notes

### Important Relationships:
1. **Seller Stock → Buyer Browse**: Products in seller's "To Ship" status should appear in buyer's browse/home screen
2. **Orders**: Same order appears in both seller's and buyer's order lists with different views
3. **Favorites**: Sync across Home, Favorites, and Product Detail screens
4. **Points**: Sync across Rewards, Checkout, and Missions screens
5. **Notifications**: Auto-generated when:
   - Order status changes
   - Badge earned
   - Mission completed
   - Favorited item back in stock
   - Points expiring soon
   - New products nearby

### Real-Time Features Needed:
- Chat messages (WebSocket)
- Order status updates
- New notifications
- Stock availability changes

---

## File Structure Reference

### Seller Routes
- `app/(seller)/dashboard.tsx` - Main dashboard
- `app/(seller)/menu.tsx` - Navigation menu
- `app/(seller)/create-new.tsx` - Create blindbox
- `app/(seller)/stock.tsx` - Inventory management
- `app/(seller)/edit-stock/[id].tsx` - Edit product
- `app/(seller)/orders.tsx` - Order management
- `app/(seller)/order-detail/[id].tsx` - Order details
- `app/(seller)/eduhub.tsx` - Educational hub
- `app/(seller)/guide/[id].tsx` - Guide details
- `app/(seller)/rewards.tsx` - Badges
- `app/(seller)/notifications.tsx` - Notifications
- `app/(seller)/settings.tsx` - Settings
- `app/(seller)/edit-profile.tsx` - Edit profile
- `app/(seller)/ai-chatbot.tsx` - AI assistant
- `app/(seller)/browsing.tsx` - Browse marketplace

### Buyer Routes
- `app/(buyer)/home.tsx` - Browse/Home screen
- `app/(buyer)/menu.tsx` - Navigation menu
- `app/(buyer)/my-orders.tsx` - Order history with rating
- `app/(buyer)/order-detail/[id].tsx` - Order details
- `app/(buyer)/favorites.tsx` - Favorited products
- `app/(buyer)/map.tsx` - Map view
- `app/(buyer)/learn.tsx` - AI Food Assistant
- `app/(buyer)/rewards.tsx` - Rewards, badges, missions
- `app/(buyer)/notifications.tsx` - Notifications
- `app/(buyer)/settings.tsx` - Settings
- `app/(buyer)/edit-profile.tsx` - Edit profile
- `app/(buyer)/addresses.tsx` - Manage addresses
- `app/(buyer)/payments.tsx` - Manage payment methods
- `app/(buyer)/referrals.tsx` - Referral program
- `app/(buyer)/help.tsx` - Help & Support
- `app/(buyer)/profile.tsx` - Profile overview

### Shared Routes
- `app/chat/index.tsx` - Chat list (role-based)
- `app/chat/[id].tsx` - Individual chat
- `app/product/[id].tsx` - Product detail
- `app/seller-profile/[id].tsx` - Seller profile (buyer view)
- `app/buyer-profile/[id].tsx` - Buyer profile (seller view)
- `app/checkout.tsx` - Checkout flow
- `app/rating/[orderId].tsx` - Rating screen
- `app/login.tsx` - Login
- `app/role-selection.tsx` - Role selection

### Assets
- `assets/badges/*.png` - Badge images (loyal, regular, eco-hero, early, reviewer, gold, quick, builder, giver, hero, trusted, weekly, champion, eco-warrior, fast)
- `assets/logo.png` - App logo
- `assets/icon.png` - App icon
- `assets/splash.png` - Splash screen

---

## Mock Data Arrays (Backend Replacement Points)

Each file with `// TODO: Replace with API call` contains mock data arrays at the top:

### Seller Files with Mock Data:
- `dashboard.tsx`: RECENT_SALES
- `stock.tsx`: STOCK_DATA
- `orders.tsx`: ORDERS_DATA
- `eduhub.tsx`: GUIDES_DATA
- `rewards.tsx`: SELLER_BADGES
- `notifications.tsx`: NOTIFICATIONS_DATA
- `settings.tsx`: USER_DATA, APP_VERSION
- `edit-profile.tsx`: INITIAL_USER_DATA
- `ai-chatbot.tsx`: SAMPLE_RESPONSES

### Buyer Files with Mock Data:
- `home.tsx`: PRODUCT_DATA, favoritedIds state
- `my-orders.tsx`: ORDERS_DATA
- `favorites.tsx`: ALL_PRODUCTS, favoritedIds state
- `learn.tsx`: RECENT_PURCHASES, SAMPLE_RESPONSES
- `rewards.tsx`: BUYER_BADGES, DAILY_MISSIONS, WEEKLY_MISSIONS, REWARDS_DATA, TOTAL_POINTS
- `notifications.tsx`: NOTIFICATIONS_DATA, BADGE_IMAGES
- `settings.tsx`: USER_DATA, APP_VERSION
- `edit-profile.tsx`: INITIAL_USER_DATA
- `profile.tsx`: MOCK_PROFILE
- `addresses.tsx`: ADDRESSES_DATA
- `payments.tsx`: PAYMENT_METHODS_DATA
- `referrals.tsx`: referralCode constant
- `help.tsx`: HELP_TOPICS

### Shared Files with Mock Data:
- `product/[id].tsx`: PRODUCT_DETAILS
- `seller-profile/[id].tsx`: SELLER_DATA
- `buyer-profile/[id].tsx`: BUYER_DATA
- `chat/index.tsx`: SELLER_CHATS_DATA, BUYER_CHATS_DATA, SELLER_DATA, BUYER_DATA
- `chat/[id].tsx`: CHAT_MESSAGES, BUYER_DATA, SELLERS, BUYER_QUICK_REPLIES, SELLER_QUICK_REPLIES
- `checkout.tsx`: USER_POINTS, AVAILABLE_REWARDS, paymentOptions
- `rating/[orderId].tsx`: SELLER_DATA

---

## Design System

### Colors
- Background: `#365441` (Dark Green)
- Primary Headers: `#2C4A34` (Dark Green)
- Cards/Content: `#E8F3E0` (Light Beige)
- Accent/Buttons: `#C85E51` (Terracotta)
- Secondary: `#6b7280` (Gray)
- Success: `#16a34a` (Green)
- Warning: `#facc15` (Yellow)

### Typography
- All text uses `fontFamily: 'System'`
- Headers: `text-xl font-bold` or `text-2xl font-bold`
- Body: `text-base` or `text-sm`
- Labels: `text-xs`

### Components
- Cards: `rounded-3xl` or `rounded-2xl` with `borderWidth: 1`, `borderColor: '#2C4A34'`
- Buttons: `rounded-3xl` with `backgroundColor: '#C85E51'` (primary) or `#2C4A34` (secondary)
- Input boxes: `rounded-3xl` with `backgroundColor: '#E8F3E0'`
- All lists use `FlatList` or manual rendering (no ScrollView nesting)

---

## Navigation Patterns

### Swipe Gestures
- **Right swipe from left edge** (both seller and buyer): Opens menu
- **Left swipe on chat items**: Reveals delete button

### Back Navigation Prevention
- Dashboard (seller) and Home (buyer) prevent back navigation to login/role-selection

### Menu Animation
- Menu slides in from the left (`animation: 'slide_from_left'`)

---

## User Flow Summary

### Seller Journey:
Login → Dashboard → Create Blindbox → Manage Stock → Receive Orders → Ship → Chat with Buyers → View Reviews → Check Badges

### Buyer Journey:
Login → Browse Products → Favorite Items → View Product Details → Checkout (Apply Rewards/Points) → Chat with Seller → Receive Order → Rate Seller → Earn Badges/Points → Ask AI Assistant

---

## Notes for Backend Team

1. **Image Uploads**: Need endpoints for:
   - Product images (blindbox photos)
   - User avatars
   - All image URLs should be returned with full paths

2. **Real-Time Features**: Consider WebSocket or Server-Sent Events for:
   - Chat messages
   - Order status updates
   - Notifications

3. **Points System**: 1 point = RM 0.01 in checkout

4. **Badge Images**: Badge images are stored locally in `/assets/badges/`. API should return badge icon filenames (e.g., "eco-hero.png") not URLs.

5. **Role Switching**: Settings allow users to switch between seller and buyer roles - ensure backend supports users having both roles.

6. **Default Favorites**: Currently items 1, 2, 3 are default favorites - this should come from user's saved favorites in production.

7. **Session Management**: Store user role (buyer/seller/both) in session to route to correct home screen on login.

8. **Geolocation**: Map and distance features will need user location permissions and geolocation API.

---

End of Documentation

