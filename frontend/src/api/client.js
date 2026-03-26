import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const FALLBACK_PRODUCTS = [
  { id: "p1", name: "Eggplant", caloriesPer100g: 24 },
  { id: "p2", name: "Poultry meat", caloriesPer100g: 240 },
  { id: "p3", name: "Bread", caloriesPer100g: 210 },
  { id: "p4", name: "Nut", caloriesPer100g: 205 },
  { id: "p5", name: "Pork meat", caloriesPer100g: 580 },
  { id: "p6", name: "Potato", caloriesPer100g: 77 },
  { id: "p7", name: "Milk", caloriesPer100g: 52 },
  { id: "p8", name: "Smoked meat", caloriesPer100g: 310 },
  { id: "p9", name: "Banana", caloriesPer100g: 89 },
  { id: "p10", name: "Beef", caloriesPer100g: 250 },
  { id: "p11", name: "Corn", caloriesPer100g: 86 },
  { id: "p12", name: "Buckwheat", caloriesPer100g: 343 },
  { id: "p13", name: "Chicken", caloriesPer100g: 239 },
  { id: "p14", name: "Lentils", caloriesPer100g: 116 },
  { id: "p15", name: "Seafood", caloriesPer100g: 99 },
  { id: "p16", name: "Flour products", caloriesPer100g: 364 },
  { id: "p17", name: "Red meat", caloriesPer100g: 288 },
  { id: "p18", name: "Olives", caloriesPer100g: 115 },
  { id: "p19", name: "Pomegranate", caloriesPer100g: 83 },
  { id: "p20", name: "Apple", caloriesPer100g: 52 },
];

async function fetchFromCandidates(candidates, options) {
  let lastResponse = null;
  for (const path of candidates) {
    const response = await fetch(`${API_BASE}${path}`, options);
    if (response.status !== 404) {
      return response;
    }
    lastResponse = response;
  }
  return lastResponse;
}

export async function calculateDailyRate(payload) {
  const response = await fetch(`${API_BASE}/public/daily-rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = data.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function addMeal(payload) {
  const { data } = await apiClient.post("/meals", payload);
  return data;
}

export async function getMeals(userId, date) {
  try {
    const { data } = await apiClient.get("/meals", {
      params: { userId, date },
    });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { meals: [] };
    }

    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Meals could not be loaded."
    );
  }
}

export async function deleteMeal(mealId, userId, date) {
  const { data } = await apiClient.delete(`/meals/${encodeURIComponent(mealId)}`, {
    params: { userId, date },
  });
  return data;
}

export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Missing refresh token");

        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function getPrivateDailyRate(payload = {}) {
  const { data } = await apiClient.post("/private/daily-rate", payload);
  return data;
}

export async function searchProducts(search = "") {
  try {
    const { data } = await apiClient.get("/products", {
      params: { search },
    });
    return data;
  } catch (error) {
    const query = String(search || "")
      .trim()
      .toLowerCase();

    const products = FALLBACK_PRODUCTS.filter((product) =>
      query ? product.name.toLowerCase().includes(query) : true
    );

    return { products };
  }
}

export const registerOperation = async (userData) => {
  const { data } = await apiClient.post("/auth/register", userData);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
};

export const loginOperation = async (credentials) => {
  try {
    const { data } = await apiClient.post("/auth/signin", credentials);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (error) {
    // Fallback for backends that only expose /auth/login.
    if (error.response?.status !== 404) {
      throw error;
    }

    const { data } = await apiClient.post("/auth/login", credentials);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  }
};

export const logoutOperation = async () => {
  await apiClient.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
