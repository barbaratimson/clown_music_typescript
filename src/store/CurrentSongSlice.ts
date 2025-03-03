import {createSlice, current} from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";
import {SongInitState} from "./initialStates";

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
    }
})


export const { changeCurrentSong } = CurrentSongSlice.actions
export default CurrentSongSlice.reducer