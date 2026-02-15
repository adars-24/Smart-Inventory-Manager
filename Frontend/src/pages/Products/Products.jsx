import { useState, useEffect } from "react";
// import api from "../services/api.js";
import api from "../../services/api";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Add, Edit, Delete, Search } from "@mui/icons-material";

const categories = ["Electronics", "Clothing", "Food", "Furniture", "Other"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    minStock: 10,
    initialStock: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ✅ Fetch products from backend
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

  // Filter
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.supplier || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        supplier: product.supplier || "",
        minStock: product.minStock ?? 10,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        sku: "",
        category: "",
        supplier: "",
        minStock: 10,
      });
    }

    setFormErrors({});
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      supplier: "",
      minStock: 10,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.sku.trim()) errors.sku = "SKU is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.supplier.trim()) errors.supplier = "Supplier is required";
    if (formData.minStock === "" || Number(formData.minStock) < 0)
      errors.minStock = "Min stock must be 0 or greater";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Create product
 const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      supplier: formData.supplier,
      minStock: Number(formData.minStock),
    };

    if (editingProduct) {
      await api.put(`/products/${editingProduct._id}`, payload);
    } else {
      await api.post("/products", payload);
    }

    await fetchProducts();
    handleCloseDialog();
  } catch (err) {
    setError(err?.response?.data?.message || "Request failed");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    setError("");
    await api.delete(`/products/${id}`);
    await fetchProducts();
  } catch (err) {
    setError(err?.response?.data?.message || "Failed to delete product");
  }
};


  const getCategoryChipColor = (category) => {
    if (category === "Electronics") return "primary";
    if (category === "Food") return "success";
    if (category === "Clothing") return "secondary";
    if (category === "Furniture") return "warning";
    return "default";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your products (stock is handled in Inventory)
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                placeholder="Search by name, SKU, supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                select
                label="Filter by Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Min Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fetchLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box sx={{ py: 4 }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Typography fontWeight={500}>{product.name}</Typography>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.category || "Other"}
                        color={getCategoryChipColor(product.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{product.supplier || "-"}</TableCell>
                    <TableCell>{product.minStock ?? 10}</TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(product)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(product._id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  error={!!formErrors.sku}
                  helperText={formErrors.sku}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  error={!!formErrors.category}
                  helperText={formErrors.category}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  error={!!formErrors.supplier}
                  helperText={formErrors.supplier}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Min Stock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  error={!!formErrors.minStock}
                  helperText={formErrors.minStock}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : editingProduct ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
