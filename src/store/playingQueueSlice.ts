import {createSlice} from "@reduxjs/toolkit";
import {TrackType} from "../utils/types/types";

interface QueueState {
    queue:Array<TrackType>
}

const initialState:QueueState = {
    queue:[{id:0,track:{id:0,title:"",artists:[{id:"",name:""}],url:"",coverUri:""}}]
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