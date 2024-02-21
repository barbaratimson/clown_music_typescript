import { createSlice } from "@reduxjs/toolkit"
import React from "react";

interface playerState {
    currentTime:number
    duration: number,
    src: string
    playing : boolean,
    loading : boolean
}

const initialState:playerState = {
    currentTime: 0,
    duration : 0,
    src: "",
    playing: false,
    loading: false
}


const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers:{
        setSrc(state, action) {
            state.src = action.payload
        },
        setDuration(state, action) {
            state.duration = action.payload
        },
        setCurrentTime(state, action) {
            state.currentTime = action.payload
        },
        playerStop(state) {
            state.playing = false
        },
        playerStart(state) {
            state.playing = true
        },
        setIsLoading(state, action) {
            state.loading= action.payload
        }
    }
})


export const { setSrc, setIsLoading,setDuration,setCurrentTime,playerStop,playerStart } = playerSlice.actions
export default playerSlice.reducer