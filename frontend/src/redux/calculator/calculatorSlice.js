import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { calculateDailyRate, getPrivateDailyRate } from "../../api/client";

const initialState = {
  height: "",
  age: "",
  currentWeight: "",
  desiredWeight: "",
  bloodType: "",
  dailyCalories: null,
  notRecommendedFoods: [],
  status: "idle",
  error: null,
};

export const fetchDailyRate = createAsyncThunk(
  "calculator/fetchDailyRate",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await calculateDailyRate(payload);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

export const fetchPrivateDailyRate = createAsyncThunk(
  "calculator/fetchPrivateDailyRate",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await getPrivateDailyRate(payload);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Network error"
      );
    }
  }
);

const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyRate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDailyRate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dailyCalories = action.payload.dailyRate;
        state.notRecommendedFoods = action.payload.notRecommendedFoods;
      })
      .addCase(fetchDailyRate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPrivateDailyRate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPrivateDailyRate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dailyCalories = action.payload.dailyRate;
        state.notRecommendedFoods = action.payload.notRecommendedFoods;
      })
      .addCase(fetchPrivateDailyRate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setField, reset } = calculatorSlice.actions;
export default calculatorSlice.reducer;
