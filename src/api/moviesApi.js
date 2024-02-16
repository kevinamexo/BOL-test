import { ENDPOINT_DISCOVER, ENDPOINT_SEARCH, ENDPOINT_MOVIE, API_KEY, ENDPOINT} from "../constants";

export const fetchDiscoverMovies = async (page) => {
  try {
    const response = await fetch(`${ENDPOINT_DISCOVER}${page>0?`&page=${page}`:'1'}`);
    if (!response.ok) {
      throw new Error("failed to fetch movies by query");
    }
    const data = await response.json();
    const discoverMovies = data.results;
    return discoverMovies;
  } catch (error) {
    console.log("Error fetching Discover movies", error);
    throw error;
  }
};

export const fetchMoviesByQuery = async (queryString) => {
  try {
    const query = encodeURIComponent(queryString);
    const response = await fetch(`${ENDPOINT_SEARCH}&query=${query}`);
  
    if (!response.ok) {
      throw new Error("failed to fetch movies by query");
    }
    const data = await response.json();
    const searchMovies = await data.results;
    return searchMovies;
  } catch (error) {
    console.log("Error fetching movies by query", error);
    throw error;
  }
};

export const fetchMovieDetails= async(id)=>{

  try {
    if(!id) return
    const movieDetailsUrl= `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
    console.log(movieDetailsUrl)
    const response = await fetch(movieDetailsUrl);
    if (!response.ok) {
      throw new Error("failed to fetch movie details");
    }
    const movieDetails = response.json();
   
    return movieDetails;
  } catch (error) {
    console.log("Error fetching movies details", error);
    throw error;
  }
}



