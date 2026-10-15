import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  query: string;
  category: string;
  zip: string;
  sort: "rated" | "reviews" | "jobs";
}

const initialState: FilterState = {
  query: "",
  category: "",
  zip: "",
  sort: "rated",
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
    resetFilters() {
      return initialState;
    },
  },
});

export const { setQuery, setCategory, setZip, setSort, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
