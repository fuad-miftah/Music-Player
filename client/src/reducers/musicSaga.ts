import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeEvery, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  createMusicStart,
  createMusicSuccess,
  createMusicFailure,
  updateMusicStart,
  updateMusicSuccess,
  updateMusicFailure,
  deleteMusicStart,
  deleteMusicSuccess,
  deleteMusicFailure,
} from './musicSlice';

interface CoverImage {
  public_id: string;
  url: string;
}

interface Audio {
  public_id: string;
  url: string;
}

interface MusicListItem {
  coverImg: CoverImage;
  audio: Audio;
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MusicFormData {
  _id: string; // Assuming this is the ID for the music entry, adjust it based on your actual data model
  title: string;
  artist: string;
  album: string;
  genre: string;
  imageFile: File;
  audioFile: File;
}

function* fetchDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axios.get, 'http://localhost:5555/api/music/allwithstat');
    yield put(fetchDataSuccess(response.data));
  } catch (error) {
    yield put(fetchDataFailure(error));
  }
}

function* createMusicSaga(action: PayloadAction<{ musicData: MusicFormData; userId: string }>): Generator<any, void, any> {
  try {
    const { musicData, userId } = action.payload;
    const response = yield call(axios.post, `http://localhost:5555/api/music/${userId}`, musicData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    yield put(createMusicSuccess(response.data));
  } catch (error) {
    yield put(createMusicFailure(error));
  }
}

function* updateMusicSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(axios.put, `http://localhost:5555/api/music/update/${action.payload._id}`, action.payload);
    yield put(updateMusicSuccess(response.data));
  } catch (error) {
    yield put(updateMusicFailure(error));
  }
}

function* deleteMusicSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    yield call(axios.delete, `http://localhost:5555/api/music/delete/${action.payload}`);
    yield put(deleteMusicSuccess(action.payload));
  } catch (error) {
    yield put(deleteMusicFailure(error));
  }
}

export function* watchMusic() {
  yield takeEvery(fetchDataStart.type, fetchDataSaga);
  yield takeEvery(createMusicStart.type, createMusicSaga);
  yield takeEvery(updateMusicStart.type, updateMusicSaga);
  yield takeEvery(deleteMusicStart.type, deleteMusicSaga);
}

