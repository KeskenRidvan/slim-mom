export function DiaryProductsListItem({ meal, onDeleteProduct }) {
  return (
    <li className="diary-products-list__item">
      <span className="diary-products-list__name">{meal.name}</span>
      <span className="diary-products-list__grams">{meal.grams} g</span>
      <span className="diary-products-list__calories">{meal.calories} kcal</span>
      <button
        type="button"
        className="diary-products-list__delete"
        onClick={() => onDeleteProduct(meal.id)}
        aria-label={`Delete ${meal.name}`}
      >
        &times;
      </button>
    </li>
  );
}
