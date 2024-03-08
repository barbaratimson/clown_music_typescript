import { createSlice } from "@reduxjs/toolkit"
import {PlaylistT, TrackT, TrackType} from "../utils/types/types";

interface currentPlaylistState {
    playlist: PlaylistT
}

const initialState:currentPlaylistState = {
    playlist: {uid:"",tracks:[],title:"",ogImage:"",description:"",cover:{uri:""},available:true,owner:{uid:0,name:"",verified:false},kind:1}
}


const CurrentPlaylistSlice = createSlice({
    name: 'currentPlaylist',
    initialState,
    reducers:{
        setCurrentPlaylist(state, action) {
            state.playlist = action.payload
        }
    }
})


export const { setCurrentPlaylist } = CurrentPlaylistSlice.actions
export default CurrentPlaylistSlice.reducer