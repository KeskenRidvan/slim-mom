import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

function resolveUserId(req, providedUserId) {
  const tokenUserId = req.user?.uid;

  if (!tokenUserId) {
    throw new Error("Unauthorized request");
  }

  if (providedUserId && providedUserId !== tokenUserId) {
    throw new Error("User mismatch");
  }

  return tokenUserId;
}

async function createMeals({ userId, date, productId, grams }) {
  const normalizedGrams = Number(grams);

  if (!userId || !date || !productId || !Number.isFinite(normalizedGrams) || normalizedGrams <= 0) {
    throw new Error("Invalid payload. Expect userId, date, productId, grams");
  }

  const db = await readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("User not found");
  }

  const product = db.products.find((p) => p.id === productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const calories = Math.round((product.caloriesPer100g * grams) / 100);

  const meal = {
    id: uuidv4(),
    productId,
    name: product.name,
    grams: normalizedGrams,
    calories,
    createdAt: new Date().toISOString(),
  };

  if (!user.diaries) user.diaries = {};
  if (!user.diaries[date]) user.diaries[date] = [];
  user.diaries[date].push(meal);

  await writeDB(db);
  return meal;
}

router.post("/meals", authMiddleware, async (req, res) => {
  try {
    const userId = resolveUserId(req, req.body.userId);
    const result = await createMeals({ ...req.body, userId });
    res.json({ message: "Meal added", meal: result });
  } catch (err) {
    res.status(err.message === "Unauthorized request" || err.message === "User mismatch" ? 403 : 400).json({
      error: err.message,
    });
  }
});

router.get("/meals", authMiddleware, async (req, res) => {
  const { date } = req.query;
  let userId;

  try {
    userId = resolveUserId(req, req.query.userId);
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }

  if (!userId || !date) {
    return res.status(400).json({ error: "Missing userId or date query params" });
  }

  const db = await readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const meals = (user.diaries && user.diaries[date]) || [];
  res.status(200).json({ meals, message: "Meals retrieved successfully" });
});

router.delete("/meals/:mealId", authMiddleware, async (req, res) => {
  const { mealId } = req.params;
  const { date } = req.query;
  let userId;

  try {
    userId = resolveUserId(req, req.query.userId);
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }

  const db = await readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.diaries || !user.diaries[date]) {
    return res.status(404).json({ error: "Meals not found for this date" });
  }

  const mealIndex = user.diaries[date].findIndex((meal) => meal.id === mealId);
  if (mealIndex === -1) {
    return res.status(404).json({ error: "Meal not found" });
  }

  user.diaries[date].splice(mealIndex, 1);

  await writeDB(db);
  res.json({ message: "Meal deleted successfully" });
});

export default router;
