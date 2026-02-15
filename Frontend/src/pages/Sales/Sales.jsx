import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Add, TrendingUp } from "@mui/icons-material";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
  });

  const [fetchLoading, setFetchLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  // ✅ Fetch products + sales history
  const fetchData = async () => {
    try {
      setError("");
      setFetchLoading(true);

      const [productsRes, salesRes] = await Promise.all([
        api.get("/products"),
        api.get("/sales/history"),
      ]);

      setProducts(productsRes.data);
      setSales(salesRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch sales data");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Dashboard cards (based on quantity)
  const totalQuantitySold = useMemo(() => {
    return sales.reduce((sum, s) => sum + (s.quantitySold || 0), 0);
  }, [sales]);

  const totalTransactions = sales.length;

  const avgItemsPerSale = totalTransactions === 0 ? 0 : totalQuantitySold / totalTransactions;

  const handleOpenDialog = () => {
    setFormData({ productId: "", quantity: "" });
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");

  };

  const handleSubmit = async () => {
    const qty = Number(formData.quantity);

    if (!formData.productId || !qty || qty <= 0) return;

    try {
      setActionLoading(true);
      setError("");

      await api.post("/sales", {
        productId: formData.productId,
        quantity: qty,
      });

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to record sale");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Sales Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and record sales (used for ML predictions)
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Record Sale
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Items Sold
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {totalQuantitySold}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Avg Items per Sale
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {avgItemsPerSale.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sales History
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity Sold</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fetchLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ py: 4 }}>
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No sales recorded yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell>
                        {new Date(sale.date).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={600}>{sale.productName}</Typography>
                      </TableCell>

                      <TableCell>{sale.sku || "-"}</TableCell>
                      <TableCell>{sale.category || "-"}</TableCell>

                      <TableCell>
                        <Chip
                          label={`${sale.quantitySold}`}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Record New Sale</DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Product"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} {product.sku ? `(${product.sku})` : ""}

                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                />
              </Grid>

              {formData.productId && formData.quantity && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: "primary.50" }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        This will:
                      </Typography>
                      <Typography variant="body2">
                        • Deduct stock from inventory
                      </Typography>
                      <Typography variant="body2">
                        • Create a SALE stock movement
                      </Typography>
                      <Typography variant="body2">
                        • Update daily SalesHistory for ML
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={actionLoading || !formData.productId || !formData.quantity}
          >
            {actionLoading ? <CircularProgress size={22} /> : "Record Sale"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
