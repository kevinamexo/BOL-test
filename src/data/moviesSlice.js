import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk('fetch-movies', async (args) => {
    const {page, apiUrl, type,initialFetch}= args
    const pageNumber= initialFetch?page+1:page;
    const response = await fetch(`${apiUrl}${page?`&page=${pageNumber}`:""}`)
    const movies=await response.json()
    
    
    return {movies:movies.results, initialFetch,type}
})

const moviesSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: [],
        searchResults:[],
        fetchStatus: '',
        isFetching:false,
        page:1,
    },
    reducers: {
        setSearchResults:(state, action)=>{
            state.searchResults=action.payload.movies
        },
        setPage:(state,action)=>{
            state.page=action.payload
        },
        setMovies:(state,action)=>{
            state.movies=action.payload
        },
        setIsFetching:(state,action)=>{
            state.isFetching=action.payload
        }

        
       
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.page= state.page + 1;
            if(action.payload.type==='search'){
        
                if(state.page===1){
                    state.searchResults=action.payload.movies
                }else{
                    
                     //prevent duplicate movies from api

                    let newMovies= action.payload.movies.filter(x=>!state.searchResults.some(result=>result.id===x.id))
                    state.searchResults=[...state.searchResults, ...newMovies]
                }
            } 
            if(action.payload.type==='discover'){
                if(action.payload.initialFetch===true){
                    state.movies = [...action.payload.movies]
                }else{
                   
                    //prevent duplicate movies from api
                    let newMovies= action.payload.movies.filter(x=>!state.movies.some(movie=>movie.id===x.id))
                    state.movies = [...state.movies,...newMovies]
                    
                }
            }



                
            state.isFetching=false
            state.fetchStatus = 'success'
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})
export const {setSearchResults,setPage,setMovies,setIsFetching}= moviesSlice.actions

export default moviesSlice