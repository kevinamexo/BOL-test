import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
    movieTrailerModal: false,
    videoKey:'',
    overview:'',
    movie:{},
    },
    reducers: {
      openModal: (state,action) => {
        state.movieTrailerModal = true
        state.videoKey = action.payload.videoKey
        state.movie= action.payload.movieData
      },
      closeModal: state => {
        state.movieTrailerModal = false
        state.videoKey=''
        state.overview=''
        state.movie={}
      },
    
    },
  });
  
  export const { openModal, closeModal } = modalSlice.actions;
  
  export default modalSlice;