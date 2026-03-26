import "../css/RightSidebar.css";

function normalizeSummary(summary) {
  return {
    date: summary?.date || "--.--.----",
    left: Number.isFinite(Number(summary?.left)) ? Number(summary.left) : 0,
    consumed: Number.isFinite(Number(summary?.consumed)) ? Number(summary.consumed) : 0,
    dailyRate: Number.isFinite(Number(summary?.dailyRate)) ? Number(summary.dailyRate) : 0,
    percentOfNormal: Number.isFinite(Number(summary?.percentOfNormal))
      ? Number(summary.percentOfNormal)
      : 0,
    notRecommendedFoods: Array.isArray(summary?.notRecommendedFoods)
      ? summary.notRecommendedFoods
      : [],
  };
}

export function RightSidebar({ summary }) {
  const data = normalizeSummary(summary);

  return (
    <aside className="right-sidebar">
      <section className="right-sidebar__summary">
        <h3 className="right-sidebar__title">Summary for {data.date}</h3>

        <dl className="summary-grid">
          <div className="summary-grid__row">
            <dt>Left</dt>
            <dd>{data.left} kcal</dd>
          </div>
          <div className="summary-grid__row">
            <dt>Consumed</dt>
            <dd>{data.consumed} kcal</dd>
          </div>
          <div className="summary-grid__row">
            <dt>Daily rate</dt>
            <dd>{data.dailyRate} kcal</dd>
          </div>
          <div className="summary-grid__row">
            <dt>n% of normal</dt>
            <dd>{data.percentOfNormal} %</dd>
          </div>
        </dl>
      </section>

      <section className="right-sidebar__foods">
        <h3 className="right-sidebar__title">Food not recommended</h3>

        {data.notRecommendedFoods.length > 0 ? (
          <ul className="not-recommended-list">
            {data.notRecommendedFoods.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="right-sidebar__hint">Your diet will be displayed here</p>
        )}
      </section>
    </aside>
  );
}
