import { all } from 'redux-saga/effects';
import { watchMusic } from './musicSaga'; // Assuming your music saga is renamed to watchMusic
import { watchLogin } from './authSaga';

export function* rootSaga() {
  yield all([
    watchMusic(), // Corrected the function name here
    watchLogin(),
    // Add other sagas here if needed
  ]);
}