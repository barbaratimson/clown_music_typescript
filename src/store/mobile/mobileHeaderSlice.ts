import {createSlice} from "@reduxjs/toolkit"
import { HeaderInitState } from "../initialStates";
interface HeaderT {
    title:string
    imgUrl?: string
    linkTo?: string,
    active:boolean
}

interface headerState {
    header:HeaderT
}


const initialState:headerState = {
    header: HeaderInitState
}


const MobileHeaderSlice = createSlice({
    name: 'Header',
    initialState,
    reducers:{
        showHeader(state, action) {
            state.header.title = action.payload.title
            state.header.imgUrl = action.payload.imgUrl
            state.header.active = true
        },
        hideHeader(state) {
            state.header.active = false
        },
    }
})


export const { showHeader, hideHeader} = MobileHeaderSlice.actions
export default MobileHeaderSlice.reducer