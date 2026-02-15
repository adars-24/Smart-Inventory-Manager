# Smart Inventory Manager

A modern, responsive inventory management system built with React that helps businesses manage products, track stock levels, analyze sales, and predict future demand using machine learning.

## Features

### Authentication
- User login and registration
- JWT token-based authentication
- Protected routes
- Secure session management

### Dashboard
- Overview cards showing:
  - Total Products
  - Low Stock Items
  - Total Sales
  - Predicted Demand (ML)
- Interactive sales trend charts
- Top-selling products visualization

### Products Management
- Complete CRUD operations for products
- Search and filter functionality
- Product attributes:
  - Name, Category, Price, Quantity, Supplier
- Visual stock status indicators
- Low stock highlighting

### Inventory & Stock Management
- Real-time stock level monitoring
- Low stock alerts
- Out of stock warnings
- Stock update functionality
- Status badges (In Stock, Low Stock, Out of Stock)

### Sales Management
- Record new sales transactions
- Sales history tracking
- Filter by date and product
- Revenue analytics
- Transaction summaries

### ML Predictions
- Demand forecasting using ML
- Historical sales trend analysis
- Confidence level indicators
- Visual prediction charts
- Actionable recommendations

### Analytics
- Monthly sales and profit charts
- Inventory turnover analysis
- Category distribution visualization
- Performance metrics

### Profile & Settings
- User profile management
- Account information editing
- Security settings
- Password management

## Tech Stack

- **React** - UI library
- **Material UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - API calls
- **Recharts** - Data visualization
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   └── Common/
│       └── ProtectedRoute.jsx
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   ├── Products/
│   │   └── Products.jsx
│   ├── Inventory/
│   │   └── Inventory.jsx
│   ├── Sales/
│   │   └── Sales.jsx
│   ├── MLPredictions/
│   │   └── MLPredictions.jsx
│   ├── Analytics/
│   │   └── Analytics.jsx
│   └── Profile/
│       └── Profile.jsx
├── services/
│   └── api.js
├── contexts/
│   └── AuthContext.jsx
├── theme.js
├── App.jsx
└── main.jsx
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## API Integration

The application expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Record new sale

### ML Predictions
- `POST /api/ml/predict` - Get demand predictions

### Analytics
- `GET /api/analytics/sales` - Get sales statistics
- `GET /api/analytics/inventory` - Get inventory statistics

## Demo Data

The application includes dummy data for demonstration purposes when the API is not available. This allows you to explore all features without a backend.

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Key Features

### Clean Architecture
- Separation of concerns
- Reusable components
- Centralized state management
- Clean folder structure

### User Experience
- Loading states
- Error handling
- Empty state UI
- Form validation
- Success/error notifications

### Security
- Protected routes
- Token-based authentication
- Automatic token refresh
- Secure API calls

## Color Scheme

- Primary: Blue (#2563eb)
- Secondary: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)
- Info: Cyan (#06b6d4)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT

## Support

For questions or issues, please open an issue on the repository.
