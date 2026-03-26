import { useCallback, useEffect, useMemo, useState } from "react";
import { addMeal, deleteMeal, getMeals, getPrivateDailyRate, searchProducts } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { DiaryDateCalendar } from "../components/DiaryDateCalendar";
import { DiaryAddProductForm } from "../components/DiaryAddProductForm";
import { DiaryProductsList } from "../components/DiaryProductsList";
import { RightSidebar } from "../components/RightSidebar";
import "../css/DiaryPage.css";

function toDiaryDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function DiaryPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => toDiaryDate(new Date()));
  const [meals, setMeals] = useState([]);
  const [mealsError, setMealsError] = useState("");
  const [dailyRate, setDailyRate] = useState(0);
  const [notRecommendedFoods, setNotRecommendedFoods] = useState([]);
  const [isMealsLoading, setIsMealsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const userId = user?.id;

  const loadMeals = useCallback(async () => {
    if (!userId) return;

    setIsMealsLoading(true);
    try {
      const response = await getMeals(userId, date);
      setMeals(Array.isArray(response.meals) ? response.meals : []);
      setMealsError("");
    } catch (error) {
      setMeals([]);
      setMealsError(error.message || "Meals could not be loaded.");
    } finally {
      setIsMealsLoading(false);
    }
  }, [date, userId]);

  const loadDailyRate = useCallback(async () => {
    try {
      const response = await getPrivateDailyRate();
      setDailyRate(Number(response.dailyRate) || 0);
      setNotRecommendedFoods(Array.isArray(response.notRecommendedFoods) ? response.notRecommendedFoods : []);
    } catch (error) {
      setDailyRate(0);
      setNotRecommendedFoods([]);
    }
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  useEffect(() => {
    if (!userId) return;
    loadDailyRate();
  }, [loadDailyRate, userId]);

  const handleAddProduct = useCallback(
    async ({ productId, grams }) => {
      if (!userId) return;
      setIsAddLoading(true);
      try {
        await addMeal({ userId, date, productId, grams });
        await loadMeals();
      } finally {
        setIsAddLoading(false);
      }
    },
    [date, loadMeals, userId]
  );

  const handleSearchProducts = useCallback(async (query) => {
    const response = await searchProducts(query);
    return Array.isArray(response.products) ? response.products : [];
  }, []);

  const handleDeleteProduct = useCallback(
    async (mealId) => {
      if (!userId) return;
      await deleteMeal(mealId, userId, date);
      await loadMeals();
    },
    [date, loadMeals, userId]
  );

  const summary = useMemo(() => {
    const consumed = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
    const left = Math.max(dailyRate - consumed, 0);
    const percentOfNormal = dailyRate > 0 ? Math.round((consumed / dailyRate) * 100) : 0;

    return {
      date,
      left,
      consumed,
      dailyRate,
      percentOfNormal,
      notRecommendedFoods,
    };
  }, [dailyRate, date, meals, notRecommendedFoods]);

  return (
    <div className="private-page">
      <section className="private-page__left">
        <DiaryDateCalendar value={date} onChange={setDate} />

        <DiaryAddProductForm
          onAddProduct={handleAddProduct}
          onSearchProducts={handleSearchProducts}
          loading={isAddLoading}
        />

        <DiaryProductsList
          meals={meals}
          onDeleteProduct={handleDeleteProduct}
          loading={isMealsLoading}
        />

        {mealsError && <p className="diary-inline-error">{mealsError}</p>}
      </section>

      <RightSidebar summary={summary} />
    </div>
  );
}
