import Navigation from "../components/Navigation";
import DailyCaloriesForm from "../components/DailyCaloriesForm";
import "../css/MainPage.css";

function MainPage() {
  return (
    <div className="main-container">
      <div className="main-shell">
        <Navigation />
        <DailyCaloriesForm />
      </div>
    </div>
  );
}

export default MainPage;
