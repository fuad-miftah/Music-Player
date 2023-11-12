// reducers/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import musicReducer from './musicSlice';
import { watchFetchData } from './musicSaga';

export const rootReducer = combineReducers({
  music: musicReducer,
});

export type RootState = ReturnType<typeof rootReducer>; // Add this line to export RootState

export function* rootSaga() {
  yield all([
    watchFetchData(),
    // Add other sagas here if needed
  ]);
}
