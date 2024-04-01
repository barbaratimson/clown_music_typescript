import {createSlice, current} from "@reduxjs/toolkit";
import {PlaylistT, TrackType} from "../utils/types/types";

interface QueueState {
    queue:Array<TrackType>
}

const initialState:QueueState = {
    queue:[{id:0,track:{id:0,title:"",artists:[{id:0,cover:{uri:""},name:"",likesCount:0}],url:"",coverUri:"",chart:{bgColor:"",listeners:0,position:0,progress:"up",shift:0}}}]
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