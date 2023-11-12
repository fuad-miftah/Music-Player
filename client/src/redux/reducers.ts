import { combineReducers } from '@reduxjs/toolkit';

// Add your reducers here

const rootReducer = combineReducers({
  // Add your reducer slices here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
