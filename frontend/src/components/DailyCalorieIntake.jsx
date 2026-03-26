import "../css/DailyCalorieIntake.css";

export default function DailyCalorieIntake({
  dailyCalories,
  notRecommendedFoods = [],
  onStart,
}) {
  const foods = Array.isArray(notRecommendedFoods) ? notRecommendedFoods : [];

  return (
    <div className="daily-calorie-intake">
      <h2 className="intake-title">Your recommended daily calorie intake is</h2>

      <div className="intake-rate">
        <span className="calorie-number">{dailyCalories || 0}</span>
        <span className="calorie-unit">kcal</span>
      </div>

      <div className="forbidden-foods">
        <h3 className="forbidden-title">Foods you should not eat</h3>
        <ol className="foods-list">
          {foods.map((food) => (
            <li key={food} className="food-item">
              {food}
            </li>
          ))}
          {foods.length === 0 && <li className="food-item">No products found.</li>}
        </ol>
      </div>

      <button type="button" className="intake-button" onClick={onStart}>
        Start losing weight
      </button>
    </div>
  );
}
