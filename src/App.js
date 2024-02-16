import { useEffect, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
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
  const navigate = useNavigate()
  const {searchResults, movies} =useSelector(state=>state.movies)

  
  const closeModal = () => setOpen(false)
  
  const closeCard = () => {

  }

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+searchQuery))
    } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER))
    }
  }

  

  useEffect(() => {
    console.log('START FETCH')
    getMovies()
  }, [])

  return (
    <div className={`App ${movieTrailerModal ===true && "full"}`}>
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
         {movieTrailerModal&&(
          <div className="modal-container">
              <Modal videoKey={videoKey}/>
          </div>
          )}
        <Routes>
          <Route path="/" element={<Movies movies={searchResults.length?searchResults:movies}  closeCard={closeCard} />} />
          <Route path="/starred" element={<Starred  />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
