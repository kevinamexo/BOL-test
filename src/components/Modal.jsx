import React,{useEffect, useState}from 'react'
import YouTubePlayer from "./YoutubePlayer";
import { useDispatch, useSelector } from 'react-redux'
import {closeModal} from '../data/modalSlice'
import {starMovie, unstarMovie} from '../data/starredSlice'
import {addToWatchLater} from '../data/watchLaterSlice'

import { MdClose } from "react-icons/md"
import '../styles/Modal.css'


const Modal = () => {
    const dispatch = useDispatch();
    const { movieTrailerModal,videoKey, movie} = useSelector((state) => state.modal);
    const { starredMovies} = useSelector((state) => state.starred);
    const favourited = starredMovies.some(item=>item.id===movie.id)


    const handleCloseModal = () => {
        dispatch(closeModal())
    };

    const handleAddFavourites=()=>{
      dispatch(starMovie({
        id: movie.id, 
        overview: movie.overview, 
        release_date: movie.release_date?.substring(0, 4),
        poster_path: movie.poster_path,
        title: movie.title
      }))
    }
    const handleAddWatchLater=()=>{
      dispatch(addToWatchLater({
        id: movie.id, 
        overview: movie.overview, 
        release_date: movie.release_date?.substring(0, 4),
        poster_path: movie.poster_path,
        title: movie.title
      }))
    }
   
    


  return (
    <div className='movie-modal'>
      
      <MdClose className="close-modal-btn" onClick={handleCloseModal}/>
         {videoKey && movieTrailerModal? (
        <>
          <YouTubePlayer videoKey={videoKey} />
          <p className='overview'>
            {movie.overview}
          </p>

        </>
        ) : (
          <div style={{ padding: "30px" }}>
            <h6>no trailer available. Try another movie</h6>
          </div>
        )}
        <div className="actions">
          <button className='watch-later' onClick={handleAddWatchLater}>Watch Later</button>
          <button className='add-favourites' onClick={handleAddFavourites}>{favourited?"Remove from Favourites":"Add to Favourites"}</button>
        </div>
    </div>
  )
}

export default Modal