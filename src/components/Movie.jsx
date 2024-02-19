import { useDispatch, useSelector } from "react-redux";
import starredSlice from "../data/starredSlice";
import watchLaterSlice from "../data/watchLaterSlice";
import placeholder from "../assets/not-found-500X750.jpeg";
import "../styles/Movie.css";
import { openModal } from "../data/modalSlice";
import fetchMovieTrailerKey from "../utils/getMovieTrailer";
import { useRef } from "react";

const Movie = ({ movie, viewTrailer, closeCard }) => {
  const state = useSelector((state) => state);
  const { starred, watchLater } = state;
  const { starMovie, unstarMovie } = starredSlice.actions;
  const { addToWatchLater, removeFromWatchLater } = watchLaterSlice.actions;
  const watchLaterButtonRef = useRef(null);
  const readMoreRef = useRef(null);
  const addFavouritesRef = useRef(null);
  const isStarred = starred.starredMovies.some((x) => x.id === movie.id);

  const dispatch = useDispatch();
  const handleViewTrailer = async (e) => {
    if (
      watchLaterButtonRef.current.contains(e.target) ||
      addFavouritesRef.current.contains(e.target) ||
      readMoreRef.current.contains(e.target)
    )
      return;
    const { videoKey, movieData } = await fetchMovieTrailerKey(movie.id);
    dispatch(openModal({ videoKey, movieData: movieData }));
  };

  const myClickHandler = (e) => {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    e.target.parentElement.parentElement.classList.remove("opened");
  };

  return (
    <div className="wrapper">
      <div className="card movie-card" onClick={handleViewTrailer}>
        <div className="card-body text-center">
          <div className="overlay" />
          <div className="info_panel">
            <div className="overview">{movie.overview}</div>
            <spain
              className="read-more"
              ref={readMoreRef}
              onClick={handleViewTrailer}
            >
              Read more...
            </spain>
            <div className="year">{movie.release_date?.substring(0, 4)}</div>
            <div ref={addFavouritesRef}>
              {!isStarred ? (
                <span
                  className="btn-star"
                  data-testid="starred-link"
                  onClick={() =>
                    dispatch(
                      starMovie({
                        id: movie.id,
                        overview: movie.overview,
                        release_date: movie.release_date?.substring(0, 4),
                        poster_path: movie.poster_path,
                        title: movie.title,
                      })
                    )
                  }
                >
                  <i className="bi bi-star" />
                </span>
              ) : (
                <span
                  className="btn-star"
                  data-testid="unstar-link"
                  onClick={() => dispatch(unstarMovie(movie))}
                >
                  <i className="bi bi-star-fill" data-testid="star-fill" />
                </span>
              )}
            </div>
            <div ref={watchLaterButtonRef}>
              {!watchLater.watchLaterMovies
                .map((movie) => movie.id)
                .includes(movie.id) ? (
                <button
                  type="button"
                  data-testid="watch-later"
                  className="btn btn-light btn-watch-later"
                  onClick={() =>
                    dispatch(
                      addToWatchLater({
                        id: movie.id,
                        overview: movie.overview,
                        release_date: movie.release_date?.substring(0, 4),
                        poster_path: movie.poster_path,
                        title: movie.title,
                      })
                    )
                  }
                >
                  Watch Later
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="remove-watch-later"
                  className="btn btn-light btn-watch-later blue"
                  onClick={() => dispatch(removeFromWatchLater(movie))}
                >
                  <i className="bi bi-check"></i>
                </button>
              )}
            </div>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleViewTrailer}
            >
              View Trailer
            </button>
          </div>
          <img
            className="center-block"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : placeholder
            }
            alt="Movie poster"
          />
        </div>
        <div className="title-section">
          <h6 className="title mobile-card">
            {movie.title}
            {isStarred ? (
              <span
                className="btn-star"
                data-testid="unstar-link"
                onClick={() => dispatch(unstarMovie(movie))}
              >
                <i className="bi bi-star-fill" data-testid="star-fill" />
              </span>
            ) : (
              ""
            )}
          </h6>
          <h6 className="title">
            {movie.title}
            <span
              className="btn-star"
              data-testid="unstar-link"
              onClick={() => dispatch(unstarMovie(movie))}
            >
              {isStarred && (
                <i className="bi bi-star-fill" data-testid="star-fill" />
              )}
            </span>
          </h6>
        </div>

        <button
          type="button"
          className="close"
          onClick={(e) => myClickHandler(e)}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default Movie;
