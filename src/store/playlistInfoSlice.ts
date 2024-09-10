import {createSlice} from "@reduxjs/toolkit"
import {PlaylistT, TrackT} from "../utils/types/types";
import {PlaylistInitState, SongInitState,} from "./initialStates";

export interface PlaylistInfoState {
    playlist:PlaylistT,
    active:boolean
}

const initialState:PlaylistInfoState = {
    playlist: PlaylistInitState,
    active:false,
}


const PlaylistInfo = createSlice({
    name: 'PlaylistInfo',
    initialState,
    reducers:{
        setPlaylistInfoActiveState(state, action) {
            state.active = action.payload
        },
        setPlaylistInfo(state, action) {
            state.playlist = action.payload
        },
    },

})

export const { setPlaylistInfoActiveState,setPlaylistInfo } = PlaylistInfo.actions
export default PlaylistInfo.reducer