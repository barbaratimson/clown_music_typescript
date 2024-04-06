import {createSlice} from "@reduxjs/toolkit";
import {TrackType} from "../utils/types/types";
import {SongInitState} from "./initialStates.js";

interface QueueState {
    queue:Array<TrackType>
}

const initialState:QueueState = {
    queue:[{id:0,track:SongInitState}]
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
        removeTrackFromQueue(state,action) {
            state.queue = state.queue.filter(track => track.id !== action.payload.id)
        },
        changeTrackPosition(state,action){
            // @ts-ignore
            state.queue.move = function(from = action.payload.from, to = action.payload.to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
        }
    }
})

export const { setQueue,addTrackToQueue,changeTrackPosition } = playingQueueSlice.actions
export default playingQueueSlice.reducer