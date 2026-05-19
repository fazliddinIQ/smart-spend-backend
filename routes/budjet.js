const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const verifyToken = require("../middleware/verifyToken");

// GET: foydalanuvchining byudjeti
router.get("/", verifyToken, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      return res.status(200).json({ monthlyBudget: 0 });
    }
    res.status(200).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
});

// POST: foydalanuvchi byudjetini saqlash
router.post("/", verifyToken, async (req, res) => {
  const { monthlyBudget } = req.body;

  try {
    let budget = await Budget.findOne({ userId: req.user.id });

    if (budget) {
      budget.monthlyBudget = monthlyBudget;
      await budget.save();
    } else {
      budget = new Budget({ userId: req.user.id, monthlyBudget });
      await budget.save();
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
});

module.exports = router;