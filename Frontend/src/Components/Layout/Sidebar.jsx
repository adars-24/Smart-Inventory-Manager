import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  Inventory2,
  PointOfSale,
  Psychology,
  Analytics,
  Person,
  Inventory,
  Group, // ✅ NEW
} from "@mui/icons-material";
import { useAuth } from "../../Contexts/AuthContext";

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  // ✅ ROLE-BASED MENU CONFIG (SINGLE DASHBOARD)
  const adminMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Products", icon: <Inventory2 />, path: "/products" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Sales", icon: <PointOfSale />, path: "/sales" },
    { text: "ML Predictions", icon: <Psychology />, path: "/ml-predictions" },
    { text: "Analytics", icon: <Analytics />, path: "/analytics" },

    // ✅ NEW ADMIN PAGE
    { text: "Manage Users", icon: <Group />, path: "/users" },

    { text: "Profile", icon: <Person />, path: "/profile" },
  ];

  const workerMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Products", icon: <Inventory2 />, path: "/products" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Sales", icon: <PointOfSale />, path: "/sales" },
    { text: "Profile", icon: <Person />, path: "/profile" },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : workerMenuItems;

  const drawer = (
    <Box>
      <Box sx={{ p: 3, display: "flex", alignItems: "center" }}>
        <Inventory2 sx={{ fontSize: 32, color: "primary.main", mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Smart Inventory
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
