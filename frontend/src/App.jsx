import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { PrivateLayout } from "./components/PrivateLayout";
import { useAuth } from "./context/AuthContext";
import { Loader } from "./components/Loader";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const MainPage = lazy(() => import("./pages/MainPage"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const DiaryPage = lazy(() => import("./pages/DiaryPage"));

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Loader />
      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/calculator" replace />
              ) : (
                <MainPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/calculator" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/registration"
            element={
              isAuthenticated ? (
                <Navigate to="/calculator" replace />
              ) : (
                <RegistrationPage />
              )
            }
          />

          <Route element={<PrivateRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/diary" element={<DiaryPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
