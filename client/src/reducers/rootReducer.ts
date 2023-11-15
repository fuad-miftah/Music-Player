import { combineReducers } from '@reduxjs/toolkit';
import musicReducer from './musicSlice';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  music: musicReducer,
  auth: authReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
