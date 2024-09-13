import {createSlice} from "@reduxjs/toolkit"
import { UserT } from "./user.types"
import { userInitialState } from "../../../store/initialStates"

export interface UserState {
    user: UserT
}

const initialState:UserState = {
    user: userInitialState
}


const User = createSlice({
    name: 'User',
    initialState,
    reducers:{
        setUser(state, action) {
            state.user = action.payload
        }
    },

})


export const { setUser } = User.actions
export default User.reducer