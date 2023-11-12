// musicSlice.ts
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

const initialState: MusicState = {
  data: null,
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
    fetchDataSuccess: (state, action: PayloadAction<{ data: MusicData }>) => {
      state.loading = false;
      state.data = action.payload.data;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = musicSlice.actions;
export default musicSlice.reducer;
