import express from "express";
const router = express.Router();

router.get("/signup", (req, res) => {
  res.json({ message: "Signup endpoint" });
});

router.get("/login", (req, res) => {
  res.json({ message: "Login endpoint" });
});

router.get("/logout", (req, res) => {
  res.json({ message: "Logout endpoint" });
});

export default router;