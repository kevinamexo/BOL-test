import { Link, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import useDebounce from '../hooks/useDebounce'
import '../styles/header.scss'
import { useEffect,useState} from "react"
import { fetchMoviesByQuery} from "../api/moviesApi"
import {setSearchResults, setPage} from '../data/moviesSlice'
import { useSearchParams } from 'react-router-dom';
import { CiTimer } from "react-icons/ci";
import useScreenWidth from '../hooks/useScreenWidth';


const Header = ({initialFetch}) => {
  
  const { starredMovies } = useSelector((state) => state.starred)
  const { page } = useSelector((state) => state.movies)
  const dispatch= useDispatch()
  const navigate= useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm= useDebounce(searchTerm,300)
  const [searchParams, setSearchParams] = useSearchParams();
  const screenWidth = useScreenWidth();



  const getSearchResults= async()=>{
    const searchResults= await fetchMoviesByQuery(debouncedSearchTerm)
    dispatch(setSearchResults({movies:searchResults}))
    return searchResults
  }


  useEffect(()=>{
    navigate('/')
    dispatch(setPage(1))
    if(!debouncedSearchTerm.length>0 && initialFetch===false){
     
      setSearchTerm('')
      dispatch(setSearchResults({movies:[]}))
     
    }else {
      setSearchParams(debouncedSearchTerm?{ search: debouncedSearchTerm }:{});
      getSearchResults()
      
    }

    return()=>{
      dispatch(setSearchResults({movies:[]}))
      dispatch(setPage(1))
      setSearchParams({}); // Clear search parameters

    }
  },[debouncedSearchTerm])


  

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => {
        setSearchTerm('')
      }
      }>
        <i className="bi bi-film" />
      </Link>

      <div className="search-input-group rounded">
          <input type="search" data-testid="search-movies"
            onChange={(e)=>{
              window.scrollTo(0, 0);
              setSearchTerm(e.target.value)
            }}
            value={searchTerm}
            className="form-control rounded" 
            placeholder="Search movies..." 
            aria-label="Search movies" 
            aria-describedby="search-addon" 
            />
      </div>   

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
          {screenWidth>480? "watch later": <CiTimer  className="header-icon"/>}
        </NavLink>
      </nav>   
    </header>
  )
}

export default Header
