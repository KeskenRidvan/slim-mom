import { useEffect, useMemo, useState } from "react";
import { CalculatorCalorieForm } from "../components/CalculatorCalorieForm";
import { RightSidebar } from "../components/RightSidebar";
import { getPrivateDailyRate } from "../api/client";
import "../css/DiaryPage.css";
import "../css/MainPage.css";

function toDiaryDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function CalculatorPage() {
  const [dailyRate, setDailyRate] = useState(0);
  const [notRecommendedFoods, setNotRecommendedFoods] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getPrivateDailyRate();
        setDailyRate(Number(response.dailyRate) || 0);
        setNotRecommendedFoods(Array.isArray(response.notRecommendedFoods) ? response.notRecommendedFoods : []);
      } catch (error) {
        setDailyRate(0);
        setNotRecommendedFoods([]);
      }
    };

    loadData();
  }, []);

  const summary = useMemo(
    () => ({
      date: toDiaryDate(new Date()),
      left: dailyRate,
      consumed: 0,
      dailyRate,
      percentOfNormal: 0,
      notRecommendedFoods,
    }),
    [dailyRate, notRecommendedFoods]
  );

  const handleCalculated = ({ dailyRate: nextDailyRate, notRecommendedFoods: nextFoods }) => {
    setDailyRate(Number(nextDailyRate) || 0);
    setNotRecommendedFoods(Array.isArray(nextFoods) ? nextFoods : []);
  };

  return (
    <div className="private-page">
      <section className="private-page__left private-page__left--calculator">
        <CalculatorCalorieForm onCalculated={handleCalculated} />
      </section>
      <RightSidebar summary={summary} />
    </div>
  );
}
