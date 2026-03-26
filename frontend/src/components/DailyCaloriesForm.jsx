import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setField,
  fetchDailyRate,
  fetchPrivateDailyRate,
} from "../redux/calculator/calculatorSlice";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import DailyCalorieIntake from "./DailyCalorieIntake";

function validatePayload(payload) {
  const nextErrors = {};

  if (!Number(payload.height) || Number(payload.height) <= 0) {
    nextErrors.height = "Height must be greater than 0.";
  }

  if (!Number(payload.age) || Number(payload.age) <= 0) {
    nextErrors.age = "Age must be greater than 0.";
  }

  if (!Number(payload.currentWeight) || Number(payload.currentWeight) <= 0) {
    nextErrors.currentWeight = "Current weight must be greater than 0.";
  }

  if (!Number(payload.desiredWeight) || Number(payload.desiredWeight) <= 0) {
    nextErrors.desiredWeight = "Desired weight must be greater than 0.";
  }

  if (!["1", "2", "3", "4", 1, 2, 3, 4].includes(payload.bloodType)) {
    nextErrors.bloodType = "Select your blood type.";
  }

  return nextErrors;
}

export default function DailyCaloriesForm({ onCalculated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { withLoader } = useUI();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    height,
    age,
    currentWeight,
    desiredWeight,
    bloodType,
    dailyCalories,
    notRecommendedFoods,
    status,
    error,
  } = useSelector((state) => state.calculator);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(setField({ field: name, value }));
    setValidationErrors((currentValue) => {
      if (!currentValue[name]) return currentValue;
      const nextValue = { ...currentValue };
      delete nextValue[name];
      return nextValue;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      height,
      age,
      currentWeight,
      desiredWeight,
      bloodType,
    };

    const nextErrors = validatePayload(payload);
    setValidationErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsModalOpen(false);
      return;
    }

    const action = isAuthenticated ? fetchPrivateDailyRate : fetchDailyRate;

    try {
      const response = await withLoader(() => dispatch(action(payload)).unwrap());
      onCalculated?.(response);
      setIsModalOpen(true);
    } catch {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStartLosingWeight = () => {
    setIsModalOpen(false);
    navigate(isAuthenticated ? "/diary" : "/login");
  };

  return (
    <>
      <div className="content-wrapper">
        <section className="calculator-section">
          <h1 className="title">Calculate your daily calorie intake right now</h1>

          <form className="calc-form" onSubmit={handleSubmit}>
            <div className="column">
              <div className="form-group">
                <label htmlFor="height">Height*</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="1"
                  value={height}
                  onChange={handleChange}
                />
                {validationErrors.height && (
                  <p className="error-text">{validationErrors.height}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="1"
                  value={age}
                  onChange={handleChange}
                />
                {validationErrors.age && <p className="error-text">{validationErrors.age}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="currentWeight">Current weight *</label>
                <input
                  type="number"
                  id="currentWeight"
                  name="currentWeight"
                  min="1"
                  value={currentWeight}
                  onChange={handleChange}
                />
                {validationErrors.currentWeight && (
                  <p className="error-text">{validationErrors.currentWeight}</p>
                )}
              </div>
            </div>

            <div className="column">
              <div className="form-group">
                <label htmlFor="desiredWeight">Desired weight *</label>
                <input
                  type="number"
                  id="desiredWeight"
                  name="desiredWeight"
                  min="1"
                  value={desiredWeight}
                  onChange={handleChange}
                />
                {validationErrors.desiredWeight && (
                  <p className="error-text">{validationErrors.desiredWeight}</p>
                )}
              </div>

              <div className="form-group">
                <span>Blood type *</span>
                <div className="radio-group">
                  {[1, 2, 3, 4].map((type) => (
                    <label key={type} className="radio-label">
                      <input
                        type="radio"
                        name="bloodType"
                        value={type}
                        checked={bloodType === String(type)}
                        onChange={handleChange}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.bloodType && (
                  <p className="error-text">{validationErrors.bloodType}</p>
                )}
              </div>
            </div>

            <div className="actions">
              <button type="submit" className="calc-button">
                Start losing weight
              </button>
            </div>
          </form>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {status === "loading" && <p>Calculating...</p>}
        {status === "succeeded" && (
          <DailyCalorieIntake
            dailyCalories={dailyCalories}
            notRecommendedFoods={notRecommendedFoods}
            onStart={handleStartLosingWeight}
          />
        )}
        {status === "failed" && <p className="error">{error}</p>}
      </Modal>
    </>
  );
}
