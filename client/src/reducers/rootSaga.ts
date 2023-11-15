import { all } from 'redux-saga/effects';
import { watchMusic } from './musicSaga'; // Assuming your music saga is renamed to watchMusic
import { watchLogin, watchVerifyUser } from './authSaga';

export function* rootSaga() {
  yield all([
    watchMusic(), // Corrected the function name here
    watchLogin(),
    watchVerifyUser(),
    // Add other sagas here if needed
  ]);
}