import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Inventory2,
  Warning,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../Contexts/AuthContext';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.50`,
            borderRadius: 2,
            p: 1.5,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();

  // 🔑 CRITICAL GUARD (prevents blank screen)
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    predictedDemand: 0,
  });

  // TEMP data (replace with backend later)
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const topProductsData = [
    { product: 'Product A', sales: 120 },
    { product: 'Product B', sales: 98 },
    { product: 'Product C', sales: 86 },
    { product: 'Product D', sales: 72 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await new Promise((res) => setTimeout(res, 800));

        setStats({
          totalProducts: 245,
          lowStockItems: 12,
          totalSales: 15420,
          predictedDemand: 8500,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isAdmin ? 'Admin Dashboard' : 'Worker Dashboard'}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isAdmin
          ? 'Complete overview of inventory, sales, and predictions.'
          : 'Quick view of inventory and daily sales.'}
      </Typography>

      {/* STATS */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Inventory2 sx={{ color: 'primary.main', fontSize: 32 }} />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={<Warning sx={{ color: 'warning.main', fontSize: 32 }} />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={`₹${stats.totalSales.toLocaleString()}`}
            icon={<TrendingUp sx={{ color: 'success.main', fontSize: 32 }} />}
            color="success"
          />
        </Grid>

        {isAdmin && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Predicted Demand"
              value={stats.predictedDemand}
              icon={<Psychology sx={{ color: 'info.main', fontSize: 32 }} />}
              color="info"
              subtitle="ML forecast"
            />
          </Grid>
        )}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={isAdmin ? 8 : 12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Sales Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Top Products
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="product" type="category" />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
