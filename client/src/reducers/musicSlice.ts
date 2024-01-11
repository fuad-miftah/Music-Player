import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface MusicData {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  uniqueGenres: string[];
  songsInEachGenre: { genre: string; count: number }[];
  artistStats: { _id: string; totalSongs: number; totalAlbums: string[] }[];
  albumStats: { _id: string; songs: string[] }[];
  musicList: MusicListItem[];
}

interface MusicState {
  data: MusicData | null;
  loading: boolean;
  error: string | null;
}

interface MusicFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  imageFile: File | null;
  audioFile: File | null;
}

const initialState: MusicState = {
  data: {
    totalSongs: 0,
    totalArtists: 0,
    totalAlbums: 0,
    uniqueGenres: [],
    songsInEachGenre: [],
    artistStats: [],
    albumStats: [],
    musicList: [],
  },
  loading: false,
  error: null,
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    fetchDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action: PayloadAction<MusicData>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createMusicStart: (state, action: PayloadAction<{ musicData: MusicFormData; userId: string }>) => {
      state.loading = true;
      state.error = null;
      console.log(action.payload);
      
    },
    createMusicSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      
      if (action.payload && action.payload.data) {
        state.data!.musicList.push(action.payload.data);
        state.data!.totalSongs = (state.data!.totalSongs || 0) + 1;
      }
    },
    createMusicFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMusicStart: (
      state,
      action: PayloadAction<{ id: string; musicId: string; formData: FormData }>
    ) => {
      state.loading = true;
      state.error = null;
      console.log(action);
    },
    updateMusicSuccess: (state, action: PayloadAction<MusicListItem>) => {
      state.loading = false;
      const updatedIndex = state.data!.musicList.findIndex(item => item._id === action.payload._id);
      if (updatedIndex !== -1) {
        state.data!.musicList[updatedIndex] = action.payload;
      }
    },
    updateMusicFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteMusicStart: (state, action: PayloadAction<{ id: string; musicId: string }>) => {
      state.loading = true;
      state.error = null;
      console.log(action.payload);
      
    },
    deleteMusicSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.data!.musicList = state.data!.musicList.filter(item => item._id !== action.payload);
    },
    deleteMusicFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = musicSlice.actions;

export default musicSlice.reducer;
