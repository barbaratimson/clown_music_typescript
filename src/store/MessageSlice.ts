import {createSlice} from "@reduxjs/toolkit"
import {TrackT} from "../utils/types/types";
import { MessageInitState,} from "./initialStates";
interface MessageT {
    message:string
    code: ErrCodeT
    active:boolean
}

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
            state.message.active = true
        },
        hideMessage(state) {
            state.message.active = false
        },
    }
})


export const { showMessage, hideMessage} = MessageSlice.actions
export default MessageSlice.reducer