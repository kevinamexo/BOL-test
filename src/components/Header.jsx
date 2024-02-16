import { Link, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import useDebounce from '../hooks/useDebounce'
import '../styles/header.scss'
import { useEffect,useState} from "react"
import { fetchMoviesByQuery} from "../api/moviesApi"
import {setSearchResults,fetchMovies} from '../data/moviesSlice'
import {ENDPOINT_DISCOVER} from  '../constants'

const Header = ({ searchMovies }) => {
  
  const { starredMovies } = useSelector((state) => state.starred)
  const dispatch= useDispatch()
  const navigate= useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm= useDebounce(searchTerm,300)

  const getSearchResults= async()=>{
    const searchResults= await fetchMoviesByQuery(debouncedSearchTerm)
    dispatch(setSearchResults({movies:searchResults}))
    return searchResults
  }


  useEffect(()=>{
    navigate('/')
    if(!debouncedSearchTerm.length){
      setSearchTerm('')
      dispatch(setSearchResults({movies:[]}))
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
    }else{
      getSearchResults()
    }
  },[debouncedSearchTerm])

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => searchMovies('')}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink to="/starred" data-testid="nav-starred" className="nav-starred">
          {starredMovies.length > 0 ? (
            <>
            <i className="bi bi-star-fill bi-star-fill-white" />
            <sup className="star-number">{starredMovies.length}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">
        <Link to="/" onClick={(e) => searchMovies('')} className="search-link" >
          <input type="search" data-testid="search-movies"
            // onKeyUp={(e) => searchMovies(e.target.value)} 
            onChange={(e)=>setSearchTerm(e.target.value)}
            value={searchTerm}
            className="form-control rounded" 
            placeholder="Search movies..." 
            aria-label="Search movies" 
            aria-describedby="search-addon" 
            />
        </Link>            
      </div>      
    </header>
  )
}

export default Header
