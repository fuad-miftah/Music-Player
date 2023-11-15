// sagas.ts

import { takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, logout, verifyUserStart, verifyUserSuccess, verifyUserFailure } from './authSlice';


interface YourLoginPayloadType {
  username: string;
  password: string;
  // Add other fields as needed based on your login requirements
}

function* loginSaga(action) {
  try {
    // Perform the login API call
    const response = yield call(axios.post, 'http://localhost:5555/api/auth/login', action.payload);

    // Dispatch success action with user data
    yield put(loginSuccess(response.data));

    // Save the access_token in the cookie
    const { access_token } = response.data.data;
    document.cookie = `access_token=${access_token}; path=/`;
  } catch (error) {
    // Dispatch failure action with error message
    yield put(loginFailure(error.message));
  }
}

function* logoutSaga() {
  try {
    // Perform the logout API call with credentials (replace 'http://localhost:5555/api/auth/logout' with your actual logout API endpoint)
    yield call(axios.post, 'http://localhost:5555/api/auth/logout', { withCredentials: true });

    // Dispatch logout action
    yield put(logout());

    // Remove access_token cookie
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error) {
    // Dispatch failure action with error message
    yield put(loginFailure(error.message));

    // Handle errors if any during logout
    console.error('Error during logout:', error);
  }
}

function* verifyUserSaga(action) {
  console.log('verifyUserSaga called');
  try {
    // Perform the user verification API call
    const response = yield call(axios.get, `http://localhost:5555/api/auth/user/${action.payload._id}`, {
      withCredentials: true,
    });

    console.log('user is authenticated');
    

    // Dispatch success action with user data
    yield put(verifyUserSuccess(response.data));
  } catch (error) {
    // Dispatch failure action with error message
    yield put(verifyUserFailure(error.message));
    // Handle authentication errors (e.g., token validation failed)
    console.log('user is not authenticated');
    console.log(error);
    // User is not authenticated
  }
}

export function* watchLogin() {
  yield takeEvery(loginStart.type, loginSaga);
}

export function* watchLogout() {
  yield takeEvery(logout.type, logoutSaga);
}

export function* watchVerifyUser() {
  console.log("watchVerifyUser saga is running");
  yield takeEvery(verifyUserStart.type, verifyUserSaga);
}
