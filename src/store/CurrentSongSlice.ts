import { createSlice } from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";

interface currentSongState {
    currentSong: TrackT
}

const initialState:currentSongState = {
    currentSong: {id:0,title:"",artist:{id:"",name:""},url:"",ogImage:""}
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