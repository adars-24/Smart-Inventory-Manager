import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert } from "@mui/material";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { TrendingUp, Inventory, ShowChart, Category } from "@mui/icons-material";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Analytics = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.get("/analytics/summary");
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const cards = data?.cards || {};

  const profitMarginFake = useMemo(() => {
    // we don't have profit data in DB
    // so we show a placeholder metric
    return cards.itemsSold30Days ? "N/A" : "N/A";
  }, [cards.itemsSold30Days]);

  if (loading) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analytics & Insights
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Real analytics from products, inventory, and sales history
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {cards.totalProducts ?? 0}
                  </Typography>
                </Box>
                <Category sx={{ fontSize: 32, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Items Sold (30d)
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {cards.itemsSold30Days ?? 0}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 32, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Low Stock Products
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="warning.main">
                    {cards.lowStockCount ?? 0}
                  </Typography>
                </Box>
                <Inventory sx={{ fontSize: 32, color: "warning.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {cards.outOfStockCount ?? 0}
                  </Typography>
                </Box>
                <ShowChart sx={{ fontSize: 32, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Daily Sales Trend (Last 30 Days)
              </Typography>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data?.salesTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="unitsSold" strokeWidth={2} name="Units Sold" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Product Category Distribution
              </Typography>

              <ResponsiveContainer width="100%" height={350}>
  <PieChart>
    <Pie
      data={data?.categoryDistribution || []}
      cx="50%"
      cy="50%"
      innerRadius={55}
      outerRadius={95}
      paddingAngle={3}
      dataKey="value"
      nameKey="name"
    >
      {(data?.categoryDistribution || []).map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>

    <Tooltip />
    <Legend verticalAlign="bottom" height={50} />
  </PieChart>
</ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Inventory Stock by Category
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.inventoryByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" name="Available Stock" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
