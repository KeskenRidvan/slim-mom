const NOT_RECOMMENDED_BY_BLOOD = {
  1: ["Pork", "Milk", "Bread", "Nut"],
  2: ["Pork", "Lentils", "Corn", "Buckwheat"],
  3: ["Seafood", "Red meat", "Poultry meat", "Flour products"],
  4: ["Pork", "Smoked meat", "Corn", "Buckwheat"],
};

export function calculateDailyCalories({
  height,
  age,
  currentWeight,
  desiredWeight,
}) {
  const result =
    10 * Number(currentWeight) +
    6.25 * Number(height) -
    5 * Number(age) -
    161 -
    10 * (Number(currentWeight) - Number(desiredWeight));

  return Math.round(result);
}

export function getNotRecommendedFoods(bloodType) {
  return NOT_RECOMMENDED_BY_BLOOD[Number(bloodType)] || [];
}
