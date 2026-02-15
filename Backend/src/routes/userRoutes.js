import express from "express";
import {
  getMe,
  updateMe,
  getAllUsers,
  createStaffUser,
  updateUserRole,
  deleteUser,
} from "../controller/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// user profile routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// admin routes
router.get("/", protect, adminOnly, getAllUsers);
router.post("/", protect, adminOnly, createStaffUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
