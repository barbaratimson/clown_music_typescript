import {createSlice} from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";
import { MessageInitState,} from "./initialStates";
interface MessageT {
    message:string
    type: MessageType
    code?: ErrCodeT
    active:boolean
    track?:TrackT
}

export type MessageType = "trackLiked" | "error" | "warning" | "message"

interface messageState {
    message:MessageT
}

export type ErrCodeT = 200 | 300 | 400 | 500

const initialState:messageState = {
    message: MessageInitState
}


const MessageSlice = createSlice({
    name: 'Message',
    initialState,
    reducers:{
        showMessage(state, action) {
            state.message.message = action.payload.message
            state.message.code = action.payload.code
            state.message.type = action.payload.type
            state.message.track = action.payload.track
            state.message.active = true
        },
        hideMessage(state) {
            state.message.active = false
        },
    }
})


export const { showMessage, hideMessage} = MessageSlice.actions
export default MessageSlice.reducer