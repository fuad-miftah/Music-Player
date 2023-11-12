import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
} from './musicSlice';

function* fetchDataSaga(): Generator<any, void, any> {
  console.log("fetch cal");
  
  try {
    const response = yield call(axios.get, 'http://localhost:5555/api/music/allwithstat');
    yield put(fetchDataSuccess(response.data));
  } catch (error) {
    yield put(fetchDataFailure(error));
  }
}

export function* watchFetchData() {
  yield takeEvery(fetchDataStart.type, fetchDataSaga);
}