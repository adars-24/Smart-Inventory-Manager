import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

import { Save, ExitToApp } from "@mui/icons-material";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // ✅ When user becomes available, update UI form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // update backend
      const res = await api.put("/users/me", {
        name: formData.name,
      });

      // update localStorage + context state (important!)
      const updatedUser = res.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess(true);
      setEditing(false);

      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔥 very important: wait for auth state
  if (authLoading) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // 🔥 if user missing, show message
  if (!user) {
    return (
      <Alert severity="warning">
        You are not logged in. Please login again.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account information
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: "3rem",
                    mb: 2,
                  }}
                >
                  {formData.name?.charAt(0)?.toUpperCase()}
                </Avatar>

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {formData.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formData.email}
                </Typography>

                <Divider sx={{ width: "100%", my: 3 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Basic Information
                </Typography>

                {!editing ? (
                  <Button variant="outlined" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!editing}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Email" value={formData.email} disabled />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving || !formData.name.trim()}
                  >
                    {saving ? <CircularProgress size={22} /> : "Save Changes"}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
