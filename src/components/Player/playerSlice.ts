import { createSlice } from "@reduxjs/toolkit"
import React from "react";
import {playerRepeatInit, playerShuffleInit} from "../../store/initialStates";

interface playerState {
    currentTime:number
    duration: number,
    src: string
    playing : boolean,
    loading : boolean,
    shuffle:boolean,
    repeat:boolean
}

const initialState:playerState = {
    currentTime: 0,
    duration : 0,
    src: "",
    playing: false,
    loading: false,
    shuffle: playerShuffleInit,
    repeat: playerRepeatInit
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
        setShuffle(state, action) {
            state.shuffle = action.payload
        },
        setRepeat(state, action) {
            state.repeat = action.payload
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


export const { setSrc, setIsLoading,setDuration,setCurrentTime,playerStop,playerStart, setShuffle, setRepeat } = playerSlice.actions
export default playerSlice.reducer