import express from "express";
import { readDB, writeDB } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  calculateDailyCalories,
  getNotRecommendedFoods,
} from "../utils/calculate.js";

const router = express.Router();

function parsePayload(body) {
  const height = Number(body.height);
  const age = Number(body.age);
  const currentWeight = Number(body.currentWeight);
  const desiredWeight = Number(body.desiredWeight);
  const bloodType = Number(body.bloodType);

  if (
    !height ||
    !age ||
    !currentWeight ||
    !desiredWeight ||
    ![1, 2, 3, 4].includes(bloodType)
  ) {
    return null;
  }

  return { height, age, currentWeight, desiredWeight, bloodType };
}

function buildDailyRate(payload) {
  const dailyRate = calculateDailyCalories(payload);
  const notRecommendedFoods = getNotRecommendedFoods(payload.bloodType);
  return { dailyRate, notRecommendedFoods };
}

router.post("/public/daily-rate", (req, res) => {
  const parsed = parsePayload(req.body || {});
  if (!parsed) {
    return res.status(400).json({ message: "Invalid form payload" });
  }

  return res.json(buildDailyRate(parsed));
});

router.post("/private/daily-rate", authMiddleware, async (req, res) => {
  const db = await readDB();
  const user = db.users.find((entry) => entry.id === req.user.uid);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const parsedFromBody = parsePayload(req.body || {});
  const parsedFromProfile = parsePayload({
    ...(user.profile || {}),
    bloodType: user.bloodType,
  });

  const payload = parsedFromBody || parsedFromProfile;
  if (!payload) {
    return res.json({
      dailyRate: Number(user.dailyRate) || 0,
      notRecommendedFoods: Array.isArray(user.notRecommendedFoods)
        ? user.notRecommendedFoods
        : [],
    });
  }

  const { dailyRate, notRecommendedFoods } = buildDailyRate(payload);

  user.profile = {
    height: payload.height,
    age: payload.age,
    currentWeight: payload.currentWeight,
    desiredWeight: payload.desiredWeight,
  };
  user.bloodType = payload.bloodType;
  user.dailyRate = dailyRate;
  user.notRecommendedFoods = notRecommendedFoods;

  await writeDB(db);
  return res.json({ dailyRate, notRecommendedFoods });
});

router.get("/products", authMiddleware, async (req, res) => {
  const search = String(req.query.search || "")
    .trim()
    .toLowerCase();

  const db = await readDB();
  const products = db.products
    .filter((product) =>
      search ? product.name.toLowerCase().includes(search) : true
    )
    .slice(0, 20)
    .map((product) => ({
      id: product.id,
      name: product.name,
      caloriesPer100g: product.caloriesPer100g,
    }));

  return res.json({ products });
});

export default router;
