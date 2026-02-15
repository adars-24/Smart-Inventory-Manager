import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";

import { Psychology, TrendingUp, Analytics } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MLPredictions = () => {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    timeframe: "7",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [error, setError] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      setError("");
      setFetchLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch products");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch sales history for chart
  const fetchSalesHistory = async (productId) => {
    try {
      const res = await api.get(`/sales/history?productId=${productId}`);
      setHistory(res.data);
    } catch (err) {
      setHistory([]);
    }
  };

  const selectedProduct = useMemo(() => {
    return products.find((p) => p._id === formData.productId);
  }, [products, formData.productId]);

  const chartData = useMemo(() => {
    // Convert sales history to recharts format
    return history.map((h) => ({
      date: new Date(h.date).toLocaleDateString(),
      sales: h.quantitySold,
    }));
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) return;

    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      // 1) Fetch chart data
      await fetchSalesHistory(formData.productId);

      // 2) Get ML + reorder suggestion
      const res = await api.post("/smart-reorder/suggest", {
        productId: formData.productId,
      });

      const data = res.data;

      setPrediction({
        ...data,
        productName: selectedProduct?.name || "Selected Product",
        timeframe: formData.timeframe,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ML Demand Predictions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Real ML predictions from your sales history + smart reorder suggestions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Psychology sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Prediction Input
                </Typography>
              </Box>

              {fetchLoading ? (
                <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    select
                    label="Select Product"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    margin="normal"
                    required
                  >
                    {products.map((product) => (
                      <MenuItem key={product._id} value={product._id}>
                        {product.name} ({product.sku})
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    select
                    label="Prediction Timeframe"
                    value={formData.timeframe}
                    onChange={(e) =>
                      setFormData({ ...formData, timeframe: e.target.value })
                    }
                    margin="normal"
                  >
                    <MenuItem value="7">Next 7 days</MenuItem>
                    <MenuItem value="30">Next 30 days</MenuItem>
                  </TextField>

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !formData.productId}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Generate Prediction"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {prediction && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Model Explanation
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Strategy used:
                </Typography>

                <Chip
                  label={prediction.strategy}
                  color={prediction.strategy === "ML_BASED" ? "success" : "warning"}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Notes:
                </Typography>

                {prediction.strategy === "RULE_BASED" ? (
                  <Typography variant="body2">
                    Not enough sales history available yet. The system used rule-based reorder logic.
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    Prediction generated using your trained regression model on recent sales patterns.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          {prediction ? (
            <Box>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Analytics sx={{ fontSize: 32, color: "success.main", mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Prediction Results
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: "primary.50", borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Predicted Demand
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary.main">
                          {prediction.predictedDemand ?? "-"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          units (next {prediction.timeframe} days)
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: "success.50", borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Suggested Reorder Qty
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" color="success.main">
                          {prediction.suggestedReorderQty}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          includes safety buffer
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Stock & Buffer Details
                  </Typography>

                  <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      • Product: <strong>{prediction.productName}</strong>
                    </Typography>

                    {"availableStock" in prediction && (
                      <Typography variant="body2" color="text.secondary">
                        • Available Stock: <strong>{prediction.availableStock}</strong>
                      </Typography>
                    )}

                    {"safetyBuffer" in prediction && (
                      <Typography variant="body2" color="text.secondary">
                        • Safety Buffer: <strong>{prediction.safetyBuffer}</strong>
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Historical Sales (Daily)
                  </Typography>

                  {chartData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No sales history available for this product yet.
                    </Typography>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          strokeWidth={2}
                          name="Units Sold"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Predictions Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Select a product and generate a prediction to see real ML-powered demand forecasting.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MLPredictions;
