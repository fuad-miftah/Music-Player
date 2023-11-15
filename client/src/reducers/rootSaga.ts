import { all } from 'redux-saga/effects';
import { watchMusic } from './musicSaga';
import { watchLogin, watchVerifyUser } from './authSaga';

export function* rootSaga() {
  yield all([
    watchMusic(),
    watchLogin(),
    watchVerifyUser(),
  ]);
}