import {createSlice} from "@reduxjs/toolkit";
import {PlaylistT, TrackType} from "../utils/types/types";

interface QueueState {
    queue:PlaylistT
}

const initialState:QueueState = {
    queue:{uid:"",tracks:[],title:"",ogImage:"",description:"",cover:{uri:""}}
}

const playingQueueSlice = createSlice({
    name:"playingQueue",
    initialState,
    reducers:{
        setQueue(state, action) {
            state.queue = action.payload
        },
        addTrackToQueue(state, action) {
            // position, track
        },
        changeTrackPosition(state, action) {

        },
    }
})

export const { setQueue,addTrackToQueue,changeTrackPosition } = playingQueueSlice.actions
export default playingQueueSlice.reducer