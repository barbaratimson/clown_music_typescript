import {createSlice, current} from "@reduxjs/toolkit";
import {QueueT, TrackType} from "../utils/types/types";
import {SongInitState} from "./initialStates";

interface QueueState {
    queue:QueueT
}
const initialState:QueueState = {
    queue:{id:0,queueTracks:[{id:0,track:SongInitState}],queueOpen:false}
}

const playingQueueSlice = createSlice({
    name:"playingQueue",
    initialState,
    reducers:{
        setQueue(state, action) {
            state.queue.id = action.payload.id
            state.queue.queueTracks = action.payload.queueTracks
        },

        setOpeningState(state, action) {
            state.queue.queueOpen = action.payload
        },
        addTrackToQueue(state, action) {
            // position, track
        },
        removeTrackFromQueue(state,action) {
            state.queue.queueTracks = state.queue.queueTracks.filter(track => track.id !== action.payload.id)
        },
        changeTrackPosition(state,action){
            // @ts-ignore
            state.queue.queueTracks.move = function(from = action.payload.from, to = action.payload.to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
        }
    }
})

export const { setQueue,addTrackToQueue,changeTrackPosition,setOpeningState } = playingQueueSlice.actions
export default playingQueueSlice.reducer