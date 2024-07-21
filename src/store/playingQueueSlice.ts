import {createSlice, current} from "@reduxjs/toolkit";
import {QueueT, TrackType} from "../utils/types/types";
import {PlaylistInitState, SongInitState} from "./initialStates";
import { trackWrap } from "../utils/trackWrap";

interface QueueState {
    queue:QueueT
}
const initialState:QueueState = {
    queue:{playlist:PlaylistInitState,queueTracks:[{id:0,track:SongInitState}],queueOpen:false}
}

const playingQueueSlice = createSlice({
    name:"playingQueue",
    initialState,
    reducers:{
        initQueue(state, action) {
            state.queue.playlist = action.payload.playlist
            state.queue.queueTracks = action.payload.queueTracks
        },
        setQueue(state, action) {
            state.queue.queueTracks = action.payload
        },
        setOpeningState(state, action) {
            state.queue.queueOpen = action.payload
        },
        addTrackToQueue(state, action) {
            state.queue.queueTracks.push(action.payload)
            console.log(current(state))
        },
        addTrackToQueuePosition(state, action) {
            const currentQueue = current(state.queue.queueTracks)
            const track = action.payload.songToAdd
            const trackExistsIndex = currentQueue.findIndex(song => song.id == track.id)
            const currentSongPosition = currentQueue.findIndex(song => song.id == action.payload.currentSong.id)
            if (trackExistsIndex !== -1) {
                changeTrackPosition({from:trackExistsIndex,to:currentSongPosition + 1})
            } else if (currentSongPosition !== -1) {
                state.queue.queueTracks.splice(currentSongPosition + 1,0,trackWrap(track))
            } else {
                return 
            }
            console.log(currentSongPosition, track)
        },
        removeTrackFromQueue(state,action) {
            state.queue.queueTracks = state.queue.queueTracks.filter(track => track.id !== action.payload.id)
        },
        changeTrackPosition(state,action){
            const currentQueue = current(state.queue.queueTracks)
            const move = function(from = action.payload.from, to = action.payload.to, array:TrackType[]) {
                array.splice(to, 0, array.splice(from, 1)[0]);
            };
            move(action.payload.from,action.payload.to,currentQueue)
        }
    }
})

export const { setQueue,addTrackToQueue,changeTrackPosition,addTrackToQueuePosition,setOpeningState,initQueue } = playingQueueSlice.actions
export default playingQueueSlice.reducer