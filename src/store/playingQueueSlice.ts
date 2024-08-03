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
const move = function(from:number, to:number, array:TrackType[]) {
    array.splice(to, 0, array.splice(from, 1)[0]);
};


const playingQueueSlice = createSlice({
    name:"playingQueue",
    initialState,
    reducers:{
        initQueue(state, action) {
            state.queue.playlist = {...action.payload.playlist, tracks:action.payload.playlist.tracks.filter((track:TrackType) => track.track.available)}
            state.queue.queueTracks = action.payload.queueTracks.filter((track:TrackType) => track.track.available)
        },
        setQueue(state, action) {
            state.queue.queueTracks = action.payload.filter((track:TrackType) => track.track.available)
        },
        setOpeningState(state, action) {
            state.queue.queueOpen = action.payload
        },
        addTrackToQueue(state, action) {
            state.queue.queueTracks.push(action.payload)
        },
        addTrackToQueuePosition(state, action) {
            const currentQueue = state.queue.queueTracks
            const track = action.payload.songToAdd
            const trackExistsIndex = currentQueue.findIndex(song => song.id == track.id)
            const currentSongPosition = currentQueue.findIndex(song => song.id == action.payload.currentSong.id)
            if (trackExistsIndex !== -1) {
                if (trackExistsIndex <= currentSongPosition) {
                    move(trackExistsIndex,currentSongPosition,state.queue.queueTracks)
                } else {
                    move(trackExistsIndex,currentSongPosition + 1,state.queue.queueTracks)
                }
            } else if (currentSongPosition !== -1) {
                state.queue.queueTracks.splice(currentSongPosition + 1,0,trackWrap(track))
            } else {
                return 
            }
        },
        removeTrackFromQueue(state,action) {
            state.queue.queueTracks = state.queue.queueTracks.filter(track => track.id !== action.payload.id)
        },
        changeTrackPosition(state,action){
            const currentQueue = current(state.queue.queueTracks)
            move(action.payload.from,action.payload.to,currentQueue)
        }
    }
})

export const { setQueue,addTrackToQueue,changeTrackPosition,addTrackToQueuePosition,setOpeningState,initQueue } = playingQueueSlice.actions
export default playingQueueSlice.reducer