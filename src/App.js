import { useEffect, useRef, useState,useCallback } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies, setPage,setMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import Modal from './components/Modal'
import './app.scss'

const App = () => {

  const { movieTrailerModal, videoKey } = useSelector((state) => state.modal);
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [isOpen, setOpen] = useState(false)
  const shouldFetch=useRef(true)
  const navigate = useNavigate()
  const {searchResults, movies, page} =useSelector(state=>state.movies)

  
  const closeModal = () => setOpen(false)
  
  // const closeCard = () => {

  // }


  const searchMovies = (query) => {
    navigate('/')
    getMovies(shouldFetch.current)
  }

  const getMovies = useCallback((initialFetch) => {   
    dispatch(fetchMovies({ apiUrl: ENDPOINT_DISCOVER, page, initialFetch: initialFetch === true ? initialFetch : false, type: 'discover' }));
  }, [dispatch, searchQuery, page]);

  const getSearchResults = useCallback((initialFetch) => {    
    dispatch(fetchMovies({apiUrl:`${ENDPOINT_SEARCH}&query=${searchQuery}`, page:page+1, initialFetch: initialFetch === true ? initialFetch : false, type: 'search' }));
  }, [dispatch, searchQuery, page]);

  

  useEffect(() => {
    if(shouldFetch.current){
      shouldFetch.current=false
      getMovies(shouldFetch.current)
    }

    return ()=>{
      dispatch(setPage(1))
      setMovies([])
    }
  }, [])
  return (
    <div className={`App ${movieTrailerModal ===true && "full"}`}>
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} initialFetch={shouldFetch.current} />

      <div className="container">
         {movieTrailerModal&&(
          <div className="modal-container">
              <Modal videoKey={videoKey}/>
          </div>
          )}
        <Routes>
          <Route path="/" element={<Movies movies={searchResults.length? searchResults:movies}  closeCard={closeCard} initialFetch={shouldFetch.current} searchQuery={searchQuery} fetchMore={searchQuery? getSearchResults:getMovies}/>} />
          <Route path="/starred" element={<Starred  />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
