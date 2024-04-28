import {createSlice} from "@reduxjs/toolkit"
import {TrackId, TrackT} from "../utils/types/types";
import { LikedSongsInitState,} from "./initialStates.js";

export interface LikedSongsState {
    likedSongs:Array<TrackId>
}

const initialState:LikedSongsState = {
    likedSongs: LikedSongsInitState
}


const LikedSongs = createSlice({
    name: 'LikedSongs',
    initialState,
    reducers:{
        setLikedSongs(state, action) {
            state.likedSongs = action.payload
        }
    },

})


export const { setLikedSongs} = LikedSongs.actions
export default LikedSongs.reducer