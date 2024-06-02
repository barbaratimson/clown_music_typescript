import { createSlice, current } from "@reduxjs/toolkit"
import {PlaylistT, TrackT, TrackType} from "../utils/types/types";
import {PlaylistInitState} from "./initialStates";

interface currentPlaylistState {
    playlist: PlaylistT
}

const initialState:currentPlaylistState = {
    playlist: PlaylistInitState
}


const CurrentPlaylistSlice = createSlice({
    name: 'currentPlaylist',
    initialState,
    reducers:{
        setCurrentPlaylist(state, action) {
            state.playlist = action.payload
            console.log(current(state))
        }
    }
})


export const { setCurrentPlaylist } = CurrentPlaylistSlice.actions
export default CurrentPlaylistSlice.reducer