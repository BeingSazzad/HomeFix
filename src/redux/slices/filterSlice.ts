import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  query: string;
  category: string;
  zip: string;
  sort: "rated" | "reviews" | "jobs" | "price_low" | "price_high";
  maxPrice: string;
  minRating: string;
  availableThisWeek: boolean;
}

const initialState: FilterState = {
  query: "",
  category: "",
  zip: "",
  sort: "rated",
  maxPrice: "",
  minRating: "",
  availableThisWeek: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setZip(state, action: PayloadAction<string>) {
      state.zip = action.payload;
    },
    setSort(state, action: PayloadAction<FilterState["sort"]>) {
      state.sort = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.maxPrice = action.payload;
    },
    setMinRating(state, action: PayloadAction<string>) {
      state.minRating = action.payload;
    },
    setAvailableThisWeek(state, action: PayloadAction<boolean>) {
      state.availableThisWeek = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setQuery,
  setCategory,
  setZip,
  setSort,
  setMaxPrice,
  setMinRating,
  setAvailableThisWeek,
  resetFilters,
} = filterSlice.actions;
export default filterSlice.reducer;
