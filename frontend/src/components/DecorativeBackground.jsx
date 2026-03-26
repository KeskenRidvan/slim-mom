import bgImg from "../img/login.png";

export function DecorativeBackground() {
  return (
    <div className="decorative-bg-container">
      <div className="decorative-bg-inner">
        <img src={bgImg} alt="" className="decorative-bg-image" />
      </div>
    </div>
  );
}
