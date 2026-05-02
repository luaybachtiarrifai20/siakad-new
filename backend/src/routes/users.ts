import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../utils/database";
import { authenticate, authorize } from "../middleware/auth";
import crypto from "crypto";

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(authenticate);
router.use(authorize(["SUPER_ADMIN"]));

// List all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await User.create({
      id,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User created successfully", id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, password } = req.body;
    
    const updateData: any = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await User.update(id, updateData);
    res.json({ message: "User updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
