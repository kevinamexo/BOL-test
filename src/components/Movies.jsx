import Movie from './Movie'
import '../styles/movies.scss'
import '../styles/Movies.css'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';


const Movies = ({ movies, viewTrailer, closeCard,fetchMore,initialFetch}) => {


    const debouncedFetchMore= debounce(fetchMore,2000);
    const {isFetching}=useSelector(state=>state.movies)
    const onLoadMore=()=>{
        fetchMore(initialFetch)
        debouncedFetchMore()
    }
    const scrollRef=useInfiniteScroll({loading:isFetching, hasNextPage:true, onLoadMore})


    return (
        <div data-testid="movies" className="movies">
            {movies&&movies.map((movie) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={movie.id}
                        viewTrailer={viewTrailer}
                        closeCard={closeCard}
                    />
                )
            })}
            <div style={{height:'20px'}} ref={scrollRef}></div>
        </div>
    )
}

export default Movies
