import { useEffect, useState } from "react";
// import api from "../services/api";
import api from "../../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";

import { Add, Remove, Warning, CheckCircle, Cancel } from "@mui/icons-material";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [mode, setMode] = useState("IN"); // IN or OUT
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const fetchInventory = async () => {
    try {
      setError("");
      setFetchLoading(true);
      const res = await api.get("/inventory");
      setInventory(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch inventory");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStockStatus = (item) => {
    const available = item.availableStock;

    if (available === 0) {
      return { label: "Out of Stock", color: "error", icon: <Cancel /> };
    }
    if (available < item.minStock) {
      return { label: "Low Stock", color: "warning", icon: <Warning /> };
    }
    return { label: "In Stock", color: "success", icon: <CheckCircle /> };
  };

  const lowStockItems = inventory.filter((item) => item.availableStock < item.minStock);
  const outOfStockItems = inventory.filter((item) => item.availableStock === 0);

  const handleOpenDialog = (item, type) => {
    setSelectedItem(item);
    setMode(type); // IN / OUT
    setQuantity("");
    setReason("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setQuantity("");
    setReason("");
  };

  const handleSubmit = async () => {
    if (!selectedItem) return;

    const qty = Number(quantity);
    if (!qty || qty <= 0) return;

    try {
      setActionLoading(true);
      setError("");

      const payload = {
        productId: selectedItem.productId,
        quantity: qty,
        reason: reason || (mode === "IN" ? "Stock added" : "Stock removed"),
      };

      if (mode === "IN") {
        await api.post("/inventory/stock-in", payload);
      } else {
        await api.post("/inventory/stock-out", payload);
      }

      await fetchInventory();
      handleCloseDialog();
    } catch (err) {
      setError(err?.response?.data?.message || "Stock update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Inventory Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Monitor stock levels and manage inventory (persistent DB data)
      </Typography>

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
                    Total Products
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {inventory.length}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Low Stock Alerts
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {lowStockItems.length}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: "warning.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {outOfStockItems.length}
                  </Typography>
                </Box>
                <Cancel sx={{ fontSize: 40, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have {lowStockItems.length} product(s) running low on stock. Consider restocking soon.
        </Alert>
      )}

      {outOfStockItems.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          You have {outOfStockItems.length} product(s) out of stock. Immediate action required!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Stock Levels
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Reserved</TableCell>
                  <TableCell>Min Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fetchLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ py: 4 }}>
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : inventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No inventory found. Add products first.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.map((item) => {
                    const status = getStockStatus(item);

                    return (
                      <TableRow key={item.inventoryId}>
                        <TableCell>
                          <Typography fontWeight={600}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.category || "Other"}
                          </Typography>
                        </TableCell>

                        <TableCell>{item.sku}</TableCell>

                        <TableCell>
                          <Typography fontWeight="bold">{item.availableStock}</Typography>
                        </TableCell>

                        <TableCell>{item.totalStock}</TableCell>
                        <TableCell>{item.reservedStock}</TableCell>
                        <TableCell>{item.minStock}</TableCell>

                        <TableCell>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                            icon={status.icon}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleOpenDialog(item, "IN")}
                          >
                            <Add />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog(item, "OUT")}
                          >
                            <Remove />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{mode === "IN" ? "Stock IN" : "Stock OUT"}</DialogTitle>

        <DialogContent>
          {selectedItem && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Product: <strong>{selectedItem.name}</strong>
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Available Stock: <strong>{selectedItem.availableStock}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                margin="normal"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />

              <TextField
                fullWidth
                label="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={actionLoading || !quantity || Number(quantity) <= 0}
          >
            {actionLoading ? <CircularProgress size={22} /> : mode === "IN" ? "Add Stock" : "Remove Stock"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
