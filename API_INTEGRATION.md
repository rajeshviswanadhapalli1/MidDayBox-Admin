# API Integration Guide

This document outlines the complete API integration setup for the Delivery Admin Dashboard.

## 🚀 Features Implemented

### ✅ Authentication System
- **Redux Toolkit** for state management
- **Axios** with interceptors for API calls
- **Token management** with automatic header injection
- **Protected routes** with authentication checks
- **Automatic logout** on token expiration

### ✅ API Structure
- **Centralized API service** with organized endpoints
- **Error handling** with proper error messages
- **Loading states** for better UX
- **Request/Response interceptors** for token management

## 📁 Project Structure

```
src/
├── store/
│   ├── store.js              # Redux store configuration
│   ├── Providers.js          # Redux Provider wrapper
│   └── slices/
│       ├── authSlice.js      # Authentication state management
│       └── apiSlice.js       # API state management
├── services/
│   └── apiService.js         # Centralized API endpoints
├── utils/
│   └── axios.js             # Axios instance with interceptors
├── hooks/
│   └── useApi.js            # Custom hook for API calls
└── components/
    └── ProtectedRoute.js    # Protected route component
```

## 🔧 Setup Instructions

### 1. API Configuration

The API base URL is configured in `src/utils/axios.js`:
```javascript
const api = axios.create({
  baseURL: 'https://middaybox-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Authentication Flow

#### Login Process:
1. User enters credentials
2. Redux dispatches `loginUser` action
3. API call to `POST /api/admin/login`
4. Token stored in localStorage and Redux state
5. Automatic redirect to dashboard

#### Token Management:
- **Automatic injection**: Token added to all API requests
- **Expiration handling**: Automatic logout on 401 responses
- **Persistent storage**: Token saved in localStorage

### 3. Protected Routes

All dashboard routes are protected using Redux state:
```javascript
const { isAuthenticated, loading } = useSelector((state) => state.auth);
```

## 📡 API Endpoints

### Authentication
```javascript
POST /api/admin/login
{
  "email": "admin@lunchapp.com",
  "password": "admin123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@lunchapp.com",
    "name": "Admin User"
  }
}
```

### Dashboard Stats
```javascript
GET /api/admin/stats

Response:
{
  "orders": 1247,
  "users": 892,
  "schools": 45
}
```

### Users Management
```javascript
GET /api/admin/delivery-boys?page=1&limit=10&search=john
GET /api/admin/parents?page=1&limit=10&search=alice
POST /api/admin/delivery-boys
PUT /api/admin/delivery-boys/:id
DELETE /api/admin/delivery-boys/:id
```

### Orders Management
```javascript
GET /api/admin/orders?page=1&limit=10&status=pending
GET /api/admin/orders/:id
PATCH /api/admin/orders/:id/status
GET /api/admin/orders/export
```

### Pricing Management
```javascript
GET /api/admin/pricing
PUT /api/admin/pricing
POST /api/admin/pricing/calculate
```

## 🔄 Redux State Structure

### Auth State
```javascript
{
  user: null,
  token: "jwt_token",
  isAuthenticated: true,
  loading: false,
  error: null
}
```

### API State
```javascript
{
  loading: false,
  error: null,
  stats: {
    orders: 1247,
    users: 892,
    schools: 45
  },
  users: {
    deliveryBoys: [],
    parents: []
  },
  orders: [],
  prices: {
    basePrice: 5.00,
    pricePerKm: 2.50,
    maxDistance: 20,
    deliveryTime: 30
  }
}
```

## 🛠 Usage Examples

### Making API Calls
```javascript
import { useApi } from '../hooks/useApi';

const { makeRequest, loading } = useApi();

const fetchData = async () => {
  try {
    const data = await makeRequest({
      method: 'GET',
      url: '/admin/stats'
    });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Using Redux Actions
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const dispatch = useDispatch();
const { isAuthenticated, loading } = useSelector((state) => state.auth);

const handleLogin = (credentials) => {
  dispatch(loginUser(credentials));
};
```

## 🔒 Security Features

### Token Management
- **Automatic injection**: Token added to Authorization header
- **Expiration handling**: Automatic logout on 401 responses
- **Secure storage**: Token stored in localStorage

### Protected Routes
- **Authentication check**: Routes protected by Redux state
- **Loading states**: Proper loading indicators
- **Redirect handling**: Automatic redirects based on auth state

### Error Handling
- **Global error state**: Centralized error management
- **User-friendly messages**: Clear error messages
- **Network error handling**: Proper handling of network issues

## 🚀 Deployment Considerations

### Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://middaybox-backend.onrender.com/api
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production Configuration
Update `src/utils/axios.js`:
```javascript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://middaybox-backend.onrender.com/api',
  // ... other config
});
```

## 🔧 Customization

### Adding New API Endpoints
1. Add to `src/services/apiService.js`
2. Create Redux slice if needed
3. Use in components with `useApi` hook

### Error Handling
- Customize error messages in `src/utils/axios.js`
- Add specific error handling in components
- Use Redux for global error state

### Loading States
- Use `loading` from `useApi` hook
- Use global loading from Redux state
- Add skeleton loaders for better UX

## 📝 Testing

### API Testing
```bash
# Test login endpoint
curl -X POST https://middaybox-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lunchapp.com","password":"admin123"}'
```

### Redux Testing
```javascript
// Test Redux actions
import { loginUser } from '../store/slices/authSlice';

// Mock API response
const mockResponse = {
  token: 'test_token',
  user: { id: 1, email: 'test@example.com' }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend domain
2. **Token Issues**: Check localStorage and Redux state
3. **Network Errors**: Verify API server is running
4. **Redux Issues**: Check store configuration and Provider setup

### Debug Tools
- **Redux DevTools**: Install browser extension for debugging
- **Network Tab**: Check API requests in browser dev tools
- **Console Logs**: Add logging for debugging

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Axios Documentation](https://axios-http.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) 