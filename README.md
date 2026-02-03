# SWIRL - AI-Powered Fashion Discovery App

A modern fashion e-commerce mobile app with AI-driven product recommendations, built with **Expo (React Native)** frontend and **NestJS** backend.

---

## 📱 App Overview

SWIRL is a fashion discovery platform that uses machine learning to provide personalized product recommendations based on user preferences, interactions, and style choices.

### Key Features
- 🎯 **AI Recommendations** - Personalized product feed based on likes/dislikes
- 🔍 **Smart Discovery** - Search and explore fashion products
- 🛒 **Cart & Wishlist** - Full e-commerce functionality
- 👤 **User Profiles** - Preferences, order history, account management
- 📦 **Order Management** - Track purchases and order history

---

## 🏗️ Architecture Diagram

```mermaid
flowchart TB
    subgraph Frontend["📱 Expo React Native App"]
        UI[("UI Screens")]
        CTX["Contexts (State)"]
        API["API Service"]
    end
    
    subgraph Backend["🖥️ NestJS Backend"]
        CTRL["Controllers"]
        SVC["Services"]
        PRISMA["Prisma ORM"]
    end
    
    subgraph Database["💾 Data Layer"]
        PG[("PostgreSQL")]
        MONGO[("MongoDB\n(Products)")]
    end
    
    UI --> CTX
    CTX --> API
    API -->|REST API| CTRL
    CTRL --> SVC
    SVC --> PRISMA
    PRISMA --> PG
    SVC -->|Product Data| MONGO
```

---

## 📂 Project Structure

```
SWIRL COMPLETE/
├── SWIRL/SWIRL/          # Frontend (Expo/React Native)
│   ├── app/              # Screens & Navigation
│   ├── components/       # Reusable UI Components
│   ├── contexts/         # Global State Management
│   ├── services/         # API Communication Layer
│   ├── hooks/            # Custom React Hooks
│   ├── constants/        # App Configuration
│   └── utils/            # Helper Functions
│
└── swirl_backend/        # Backend (NestJS)
    ├── src/modules/      # Feature Modules
    ├── prisma/           # Database Schema
    └── scripts/          # Utility Scripts
```

---

## 📱 Frontend Flow

### Technology Stack
- **Framework**: Expo SDK 54 (React Native)
- **Navigation**: Expo Router (File-based)
- **Styling**: NativeWind (TailwindCSS)
- **State**: React Context API
- **HTTP Client**: Axios

### Screen Navigation

```mermaid
flowchart LR
    subgraph Auth["🔐 Authentication"]
        A1[auth.tsx] --> A2[otp-verify.tsx]
        A2 --> A3[create-username.tsx]
    end
    
    subgraph Onboard["🎨 Onboarding"]
        O1[onboarding.tsx] --> O2[gender-select.tsx]
        O2 --> O3[feed-select.tsx]
        O3 --> O4[location-select.tsx]
    end
    
    subgraph Main["🏠 Main App (Tabs)"]
        T1[index.tsx\nHome]
        T2[discovery.tsx\nSearch]
        T3[swirl.tsx\nAI Feed]
        T4[cart.tsx\nCart]
        T5[account.tsx\nProfile]
    end
    
    Auth --> Onboard
    Onboard --> Main
```

### Main Tabs

| Tab | Screen | Description |
|-----|--------|-------------|
| 🏠 **Home** | `index.tsx` | Browse products, filter by category |
| 🔍 **Discovery** | `discovery.tsx` | Search products, explore categories |
| ✨ **Swirl** | `swirl.tsx` | AI-powered recommendation feed (swipe UI) |
| 🛒 **Cart** | `cart.tsx` | View cart, manage quantities, checkout |
| 👤 **Account** | `account.tsx` | Profile, orders, settings |

### Context (State Management)

| Context | Purpose |
|---------|---------|
| `AuthContext` | User authentication, JWT tokens, session |
| `CartContext` | Cart items, add/remove/update quantities |
| `LikesContext` | Liked/disliked products for recommendations |
| `ProductFeedContext` | Product listings, pagination, filters |
| `UserPreferencesContext` | User style preferences, sync with backend |
| `RecommendationContext` | AI recommendation scoring logic |

### API Communication Flow

```mermaid
sequenceDiagram
    participant UI as Screen
    participant CTX as Context
    participant API as api.tsx
    participant BE as Backend

    UI->>CTX: User action (e.g., add to cart)
    CTX->>API: API.cart.add(itemId)
    API->>API: Inject JWT token
    API->>BE: POST /cart {itemId, quantity}
    BE-->>API: Response
    API-->>CTX: Update state
    CTX-->>UI: Re-render
```

---

## 🖥️ Backend Flow

### Technology Stack
- **Framework**: NestJS 11
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: JWT + OTP
- **API Docs**: Swagger
- **Events**: RabbitMQ (optional)
- **Cache**: Redis (optional)

### Module Architecture

```mermaid
flowchart TB
    subgraph Modules["📦 Feature Modules"]
        AUTH["auth\nOTP, JWT, Login"]
        USERS["users\nProfile Management"]
        PRODUCTS["products\nProduct Catalog"]
        CART["cart\nShopping Cart"]
        WISHLIST["wishlist\nSaved Items"]
        ORDERS["orders\nOrder Management"]
        INTERACT["interactions\nML Data Collection"]
        PREFS["preferences\nUser Preferences"]
    end
    
    subgraph Core["🔧 Core"]
        PRISMA["PrismaService"]
        GUARD["JwtAuthGuard"]
    end
    
    AUTH --> GUARD
    USERS & CART & WISHLIST & ORDERS & INTERACT & PREFS --> GUARD
    GUARD --> PRISMA
```

### API Endpoints Summary

| Module | Endpoints | Auth Required |
|--------|-----------|---------------|
| **Auth** | `POST /auth/otp/request`, `POST /auth/otp/verify`, `GET /auth/me` | Partial |
| **Users** | `GET /users/me`, `PUT /users/me` | ✅ |
| **Products** | `GET /products`, `POST /products/recommend`, `POST /products/profile` | Partial |
| **Cart** | `GET /cart`, `POST /cart`, `PUT /cart/:id`, `DELETE /cart/:id` | ✅ |
| **Wishlist** | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:id` | ✅ |
| **Orders** | `GET /orders`, `POST /orders`, `GET /orders/:id` | ✅ |
| **Interactions** | `POST /interactions`, `GET /interactions` | ✅ |
| **Preferences** | `GET /preferences`, `POST /preferences` | ✅ |

### Database Schema

```mermaid
erDiagram
    User ||--o{ CartItem : has
    User ||--o{ WishlistItem : has
    User ||--o{ Order : places
    User ||--o{ Address : has
    User ||--o{ UserInteraction : generates
    User ||--o{ UserPreference : sets
    
    User {
        uuid id PK
        string email UK
        string phone UK
        string name
        enum role
        enum status
    }
    
    CartItem {
        uuid id PK
        uuid userId FK
        int itemId
        int quantity
    }
    
    Order {
        uuid id PK
        uuid userId FK
        string orderNumber UK
        string status
        float totalAmount
        json items
    }
```

### Request Flow

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant Guard as JwtAuthGuard
    participant Controller as Controller
    participant Service as Service
    participant Prisma as PrismaService
    participant DB as PostgreSQL

    App->>Controller: HTTP Request + JWT
    Controller->>Guard: Validate Token
    Guard-->>Controller: User Attached
    Controller->>Service: Business Logic
    Service->>Prisma: Database Query
    Prisma->>DB: SQL
    DB-->>Prisma: Result
    Prisma-->>Service: Entity
    Service-->>Controller: Response
    Controller-->>App: JSON Response
```

---

## 🔗 Frontend-Backend Integration

### How They Connect

The frontend communicates with the backend through a **centralized API service** (`services/api.tsx`) that handles all HTTP requests.

```mermaid
flowchart LR
    subgraph Frontend["📱 Frontend"]
        Screen["Screen/Component"]
        Context["Context"]
        APIService["api.tsx"]
    end
    
    subgraph Transport["🌐 HTTP"]
        Axios["Axios Instance"]
        JWT["JWT Interceptor"]
    end
    
    subgraph Backend["🖥️ Backend"]
        Controller["Controller"]
        Guard["JwtAuthGuard"]
        Service["Service"]
    end
    
    Screen --> Context
    Context --> APIService
    APIService --> Axios
    Axios --> JWT
    JWT -->|"Authorization: Bearer token"| Guard
    Guard --> Controller
    Controller --> Service
```

### API Service Layer (`services/api.tsx`)

The API service is the **single point of communication** with the backend:

```typescript
// All API calls go through this centralized service
export const API = {
    auth: {
        requestOtp: (emailOrPhone) => api.post('/auth/otp/request', {...}),
        verifyOtp: (emailOrPhone, code) => api.post('/auth/otp/verify', {...}),
        getMe: () => api.get('/auth/me'),
    },
    cart: {
        get: () => api.get('/cart'),
        add: (itemId, quantity) => api.post('/cart', { itemId, quantity }),
        // ...
    },
    // ... other modules
};
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App as Mobile App
    participant Auth as AuthContext
    participant API as api.tsx
    participant BE as Backend

    User->>App: Enter phone/email
    App->>API: API.auth.requestOtp()
    API->>BE: POST /auth/otp/request
    BE-->>API: OTP sent
    
    User->>App: Enter OTP
    App->>API: API.auth.verifyOtp()
    API->>BE: POST /auth/otp/verify
    BE-->>API: { access_token, user }
    API->>Auth: setAuthToken(token)
    Auth->>Auth: Store in SecureStore
    
    Note over App,BE: All subsequent requests include JWT
    
    App->>API: API.cart.get()
    API->>API: Inject "Authorization: Bearer token"
    API->>BE: GET /cart
    BE->>BE: JwtAuthGuard validates token
    BE-->>API: Cart data
```

### Token Management

```typescript
// Automatic token injection (api.tsx)
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Automatic 401 handling - logout on expired token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('auth_token');
            onUnauthorized?.(); // Trigger logout
        }
        return Promise.reject(error);
    }
);
```

### Data Sync Patterns

| Pattern | Flow | Example |
|---------|------|---------|
| **Read** | Context → API → Backend → Response → Update State | Fetching cart items |
| **Write** | User Action → Context → API → Backend → Success → Refetch | Adding to cart |
| **Optimistic** | Update State → API → Backend → Rollback if fail | Toggle wishlist |
| **Background** | Record action → API → Backend (non-blocking) | Track interactions |

### Example: Cart Integration

**Frontend (CartContext.tsx)**
```typescript
const addToCart = async (product: Product) => {
    // Call backend API
    const response = await API.cart.add(product.item_id, 1);
    
    // Update local state
    setCartItems(prev => [...prev, response.data]);
    
    // Record interaction for ML
    API.interactions.record('CART_ADD', product.item_id);
};
```

**Backend (cart.controller.ts)**
```typescript
@Post()
async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(
        req.user.id,      // From JWT
        dto.itemId,
        dto.quantity
    );
}
```

### User Preferences Sync

```mermaid
sequenceDiagram
    participant App as Mobile App
    participant Prefs as UserPreferencesContext
    participant API as api.tsx
    participant BE as Backend

    Note over App: User completes onboarding
    
    App->>Prefs: setPreferences({gender, likes, size})
    Prefs->>Prefs: Save to AsyncStorage (offline)
    Prefs->>API: API.products.saveProfile(preferences)
    API->>BE: POST /products/profile
    BE->>BE: Save to UserPreference table
    BE-->>API: Success
    
    Note over App: Later - fetch recommendations
    
    App->>API: API.products.getRecommendations()
    API->>BE: POST /products/recommend/user
    BE->>BE: Load user profile
    BE->>BE: Score products
    BE-->>API: Sorted product list
    API-->>Prefs: Update feed
```

### Endpoint Mapping

| Frontend Method | Backend Route | Guard | Purpose |
|-----------------|---------------|-------|---------|
| `API.auth.requestOtp()` | `POST /auth/otp/request` | ❌ | Request login OTP |
| `API.auth.verifyOtp()` | `POST /auth/otp/verify` | ❌ | Verify & get JWT |
| `API.auth.getMe()` | `GET /auth/me` | ✅ | Get current user |
| `API.users.getProfile()` | `GET /users/me` | ✅ | Detailed profile |
| `API.users.updateProfile()` | `PUT /users/me` | ✅ | Update name/avatar |
| `API.products.getAll()` | `GET /products` | ❌ | Browse products |
| `API.products.getRecommendations()` | `POST /products/recommend/user` | ✅ | AI recommendations |
| `API.cart.get()` | `GET /cart` | ✅ | Fetch cart |
| `API.cart.add()` | `POST /cart` | ✅ | Add item |
| `API.cart.update()` | `PUT /cart/:id` | ✅ | Update quantity |
| `API.cart.remove()` | `DELETE /cart/:id` | ✅ | Remove item |
| `API.wishlist.get()` | `GET /wishlist` | ✅ | Fetch wishlist |
| `API.wishlist.add()` | `POST /wishlist` | ✅ | Add to wishlist |
| `API.orders.create()` | `POST /orders` | ✅ | Place order |
| `API.orders.getAll()` | `GET /orders` | ✅ | Order history |
| `API.interactions.record()` | `POST /interactions` | ✅ | Track for ML |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd swirl_backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

Backend runs at: `http://localhost:4000`  
API Docs: `http://localhost:4000/api/docs`

### Frontend Setup

```bash
cd SWIRL/SWIRL

# Install dependencies
npm install

# Start Expo
npx expo start
```

Scan QR code with Expo Go app or run on emulator.

---

## 🔧 Environment Variables

### Backend (`.env`)
```env
PORT=4000
DATABASE_URL="postgresql://user:pass@localhost:5432/swirl"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
MONGODB_URI="mongodb://localhost:27017/swirl"
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### Frontend (`constants/Config.ts`)
```typescript
API_BASE_URL: 'http://YOUR_IP:4000/api/v1'
```

---

## 📝 Development Notes

### Adding New Features
1. **Backend**: Create module in `src/modules/`
2. **Frontend**: Add API methods to `services/api.tsx`
3. **State**: Create Context if needed in `contexts/`

### Testing API
- Swagger UI: `http://localhost:4000/api/docs`
- Use JWT token from login response

---

## 📄 License

Private - All rights reserved.
