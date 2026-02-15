import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import api from "../../services/api";
import { useAuth } from "../../Contexts/AuthContext";

const Users = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  // dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const fetchUsers = async () => {
    try {
      setError("");
      setFetchLoading(true);

      const res = await api.get("/users"); // ✅ token auto-attached
      setUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = () => {
    setFormData({ name: "", email: "", password: "", role: "staff" });
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateUser = async () => {
    try {
      setError("");
      setLoading(true);

      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }

      await api.post("/users", formData);
      await fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      setError("");
      await api.put(`/users/${id}/role`, { role });
      await fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setError("");
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleChipColor = (role) => {
    if (role === "admin") return "primary";
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
            Manage Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add staff users and manage roles
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Users List
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary" sx={{ py: 3 }}>
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => {
                    const isSelf = user?._id === u._id;

                    return (
                      <TableRow key={u._id}>
                        <TableCell>
                          <Typography fontWeight={600}>{u.name}</Typography>
                        </TableCell>

                        <TableCell>{u.email}</TableCell>

                        <TableCell>
                          <TextField
                            select
                            size="small"
                            value={u.role}
                            disabled={isSelf}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            sx={{ minWidth: 140 }}
                          >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                          </TextField>
                        </TableCell>

                        <TableCell>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                        </TableCell>

                        <TableCell align="right">
                          <Chip
                            label={u.role}
                            color={getRoleChipColor(u.role)}
                            size="small"
                            sx={{ mr: 1 }}
                          />

                          <IconButton
                            color="error"
                            disabled={isSelf}
                            onClick={() => handleDelete(u._id)}
                          >
                            <Delete />
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

      {/* Add user dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <TextField
              fullWidth
              select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser} disabled={loading}>
            {loading ? <CircularProgress size={22} /> : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
