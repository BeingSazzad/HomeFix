import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IntakeDraft } from "@/types";

const emptyDraft: IntakeDraft = {
  problem: "",
  categorySlug: "",
  zip: "",
  title: "",
  summary: "",
  followUps: [],
};

interface IntakeState {
  draft: IntakeDraft;
}

const initialState: IntakeState = {
  draft: emptyDraft,
};

const intakeSlice = createSlice({
  name: "intake",
  initialState,
  reducers: {
    saveDraft(state, action: PayloadAction<IntakeDraft>) {
      state.draft = action.payload;
    },
    clearDraft(state) {
      state.draft = emptyDraft;
    },
  },
});

export const { saveDraft, clearDraft } = intakeSlice.actions;
export default intakeSlice.reducer;
