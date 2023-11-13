// rootSaga.ts

import { all } from 'redux-saga/effects';
import { watchFetchData } from './musicSaga';
import { watchLogin } from './authSaga';

export function* rootSaga() {
  yield all([
    watchFetchData(),
    watchLogin(),
    // Add other sagas here if needed
  ]);
}
