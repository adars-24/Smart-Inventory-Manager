import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './Contexts/AuthContext';
import theme from './theme';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './Components/Layout/Layout';
import ProtectedRoute from './Components/Common/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Inventory from './pages/Inventory/Inventory';
import Sales from './pages/Sales/Sales';
import MLPredictions from './pages/MLPredictions/MLPredictions';
import Analytics from './pages/Analytics/Analytics';
import Profile from './pages/Profile/Profile';
import Users from './pages/Users/Users';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected area */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>

                {/* Single dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Shared routes */}
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/profile" element={<Profile />} />

                {/* Admin-only routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ml-predictions" element={<MLPredictions />} />
                  <Route path="/users" element={<Users />} />
                </Route>

              </Route>
            </Route>

            {/* Redirect root */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
