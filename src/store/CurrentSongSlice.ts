import { createSlice } from "@reduxjs/toolkit"
import {TrackT, TrackType} from "../utils/types/types";

interface currentSongState {
    currentSong: TrackT
}

const initialState:currentSongState = {
    currentSong: {id:0,title:"",artists:[{id:"",name:""}],url:"",coverUri:"",chart:{bgColor:"",listeners:0,position:0,progress:"up",shift:0}}
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