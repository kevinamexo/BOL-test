import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import "../styles/header.scss";
import { useEffect, useState } from "react";
import { fetchMoviesByQuery } from "../api/moviesApi";
import { setSearchResults, setPage, setSearchTerm } from "../data/moviesSlice";
import { useSearchParams } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import useScreenWidth from "../hooks/useScreenWidth";

const Header = ({ initialFetch }) => {
  const { starredMovies } = useSelector((state) => state.starred);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchInputValue, 300);
  const [searchParams, setSearchParams] = useSearchParams();
  const screenWidth = useScreenWidth();

  const getSearchResults = async () => {
    const searchResults = await fetchMoviesByQuery(debouncedSearchTerm);
    dispatch(setSearchResults({ movies: searchResults }));
    return searchResults;
  };

  useEffect(() => {
    navigate("/");
    dispatch(setPage(1));
    dispatch(setSearchTerm(debouncedSearchTerm));
    if (!debouncedSearchTerm.length > 0 && initialFetch === false) {
      setSearchInputValue("");
      dispatch(setSearchResults({ movies: [] }));
    } else {
      setSearchParams(
        debouncedSearchTerm ? { search: debouncedSearchTerm } : {}
      );
      getSearchResults();
    }

    return () => {
      dispatch(setSearchResults({ movies: [] }));
      dispatch(setPage(1));
      setSearchParams({}); // Clear search parameters
    };
  }, [debouncedSearchTerm]);

  return (
    <header>
      <Link
        to="/"
        data-testid="home"
        onClick={() => {
          setSearchInputValue("");
        }}
      >
        <i className="bi bi-film" />
      </Link>

      <div className="search-input-group rounded">
        <input
          type="search"
          data-testid="search-movies"
          onChange={(e) => {
            window.scrollTo(0, 0);
            setSearchInputValue(e.target.value);
          }}
          value={searchInputValue}
          className="form-control rounded"
          placeholder="Search movies..."
          aria-label="Search movies"
          aria-describedby="search-addon"
        />
      </div>

      <nav>
        <NavLink
          to="/starred"
          data-testid="nav-starred"
          className="nav-starred"
        >
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
          {screenWidth > 480 ? (
            "watch later"
          ) : (
            <CiTimer className="header-icon" />
          )}
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
