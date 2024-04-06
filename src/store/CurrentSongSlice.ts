import {createSlice} from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";
import {SongInitState} from "./initialStates.js";

interface currentSongState {
    currentSong: TrackT
}

const initialState:currentSongState = {
    currentSong: SongInitState
}


const CurrentSongSlice = createSlice({
    name: 'CurrentSong',
    initialState,
    reducers:{
        changeCurrentSong(state, action) {
            state.currentSong = action.payload
        },
        updateSongLink(state,action) {
            state.currentSong.url = action.payload
        }
    }
})


export const { changeCurrentSong, updateSongLink } = CurrentSongSlice.actions
export default CurrentSongSlice.reducer