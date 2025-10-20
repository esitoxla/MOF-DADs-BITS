import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [],
  editingIndex: null,
  isEditing: false,
  formValues: {},
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    addRecord: (state, action) => {
      state.records.push(action.payload);
    },
    deleteRecord: (state, action) => {
      state.records.splice(action.payload, 1);
    },
    setFormValues: (state, action) => {
      state.formValues = action.payload;
    },
    updateRecord: (state, action) => {
      const { index, updatedRecord } = action.payload;
      state.records[index] = updatedRecord;
      state.isEditing = false;
      state.editingIndex = null;
      state.formValues = {};
    },
    startEditing: (state, action) => {
      state.isEditing = true;
      state.editingIndex = action.payload.index;
      state.formValues = action.payload.record;
    },
    cancelEditing: (state) => {
      state.isEditing = false;
      state.editingIndex = null;
      state.formValues = {};
    },
  },
});

export const {
  addRecord,
  deleteRecord,
  updateRecord,
  startEditing,
  cancelEditing,
  setFormValues,
} = budgetSlice.actions;

export default budgetSlice.reducer;
