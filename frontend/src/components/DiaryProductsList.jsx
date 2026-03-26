import { DiaryProductsListItem } from "./DiaryProductsListItem";

export function DiaryProductsList({ meals, onDeleteProduct, loading = false }) {
  if (loading) {
    return <p className="diary-list-empty">Loading meals...</p>;
  }

  if (!meals.length) {
    return <p className="diary-list-empty">No products added for this date yet.</p>;
  }

  return (
    <ul className="diary-products-list">
      {meals.map((meal) => (
        <DiaryProductsListItem
          key={meal.id}
          meal={meal}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
    </ul>
  );
}
