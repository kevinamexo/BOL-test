import { createSlice } from "@reduxjs/toolkit";

const watchLaterSlice = createSlice({
  name: "watch-later",
  initialState: {
    watchLaterMovies: [],
  },
  reducers: {
    addToWatchLater: (state, action) => {
      const findMovie = state.watchLaterMovies.some(
        (movie) => movie.id === action.payload.id
      );
      if (findMovie) return;
      state.watchLaterMovies = [action.payload, ...state.watchLaterMovies];
    },
    removeFromWatchLater: (state, action) => {
      const indexOfId = state.watchLaterMovies.findIndex(
        (key) => key.id === action.payload.id
      );
      state.watchLaterMovies.splice(indexOfId, 1);
    },
    remveAllWatchLater: (state) => {
      state.watchLaterMovies = [];
    },
  },
});

export const { addToWatchLater, removeFromWatchLater, remveAllWatchLater } =
  watchLaterSlice.actions;
export default watchLaterSlice;
