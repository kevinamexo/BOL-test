import {fetchMovieDetails} from '../api/moviesApi'

const fetchMovieTrailerKey =async(id)=>{
    const videoData= await fetchMovieDetails(id)

    if (videoData.videos && videoData.videos.results.length) {
        const trailer = videoData.videos.results.find(
            (vid) => vid.type === "Trailer"
        );
        return{
            movieData:videoData,
            videoKey:trailer ? trailer.key : videoData.videos.results[0].key,
            msg:'Trailer found'
        }
    }else{
        return {movieData:videoData,videoKey:null, msg:'Trailer not found'}
    }
}

export default fetchMovieTrailerKey