import {createSlice} from "@reduxjs/toolkit";
import {PlaylistT, TrackType} from "../utils/types/types";

interface QueueState {
    queue:PlaylistT
}

const initialState:QueueState = {
    queue:{uid:"",tracks:[],title:"",ogImage:"",description:"",cover:{uri:""},available:true,owner:{uid:0,name:"",verified:false},kind:0}
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
            state.queue.tracks = state.queue.tracks.filter(track => track.id !== action.payload.id)
        },
        changeTrackPosition(state,action){
            // @ts-ignore
            state.queue.tracks.move = function(from = action.payload.from, to = action.payload.to) {
                this.splice(to, 0, this.splice(from, 1)[0]);
            };
        }
    }
})

export const { setQueue,addTrackToQueue,changeTrackPosition } = playingQueueSlice.actions
export default playingQueueSlice.reducer