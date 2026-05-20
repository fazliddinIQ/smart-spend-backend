const express = require("express");

const Expense = require("../models/Expense");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemName, category, amount } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      itemName,
      category,
      amount,
    });

    res.json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { itemName, category, amount } = req.body;
    
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { itemName, category, amount },
      { new: true }
    );

    res.json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;