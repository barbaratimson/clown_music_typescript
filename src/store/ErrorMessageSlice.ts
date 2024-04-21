import {createSlice} from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";
import {ErrorMessageInitState, } from "./initialStates.js";
interface ErrorMessageT {
    message:string
    code: ErrCodeT
    active:boolean
}

interface ErrorMessageState {
    errorMessage:ErrorMessageT
}

export type ErrCodeT = 200 | 300 | 400 | 500

const initialState:ErrorMessageState = {
    errorMessage: ErrorMessageInitState
}


const CurrentSongSlice = createSlice({
    name: 'ErrorMessage',
    initialState,
    reducers:{
        setErrorMessage(state, action) {
            state.errorMessage.message = action.payload.message
            state.errorMessage.code = action.payload.code
        },
        setMessageActive(state,action) {
            state.errorMessage.active = action.payload
        }
    }
})


export const { setErrorMessage, setMessageActive } = CurrentSongSlice.actions
export default CurrentSongSlice.reducer