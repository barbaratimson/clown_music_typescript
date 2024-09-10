import {createSlice} from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";
import {SongInitState,} from "./initialStates";

export interface TrackInfoState {
    track:TrackT,
    active:boolean
}

const initialState:TrackInfoState = {
    track: SongInitState,
    active:false
}


const TrackInfo = createSlice({
    name: 'TrackInfo',
    initialState,
    reducers:{
        setTrackInfoActiveState(state, action) {
            state.active = action.payload
        },
        setTrackInfo(state, action) {
            state.track = action.payload
        },
    },

})


export const { setTrackInfoActiveState,setTrackInfo } = TrackInfo.actions
export default TrackInfo.reducer