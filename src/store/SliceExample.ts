import { createSlice } from "@reduxjs/toolkit"
import { Example } from "../utils/types/types"

interface exampleState {
    example:Example
}

const initialState:exampleState = {
    example:{example:"fdfd"}
}


const exampleSlice = createSlice({
    name: 'example',
    initialState,
    reducers:{
        changeExample(state, action) {
            state.example = action.payload
        }
    }
})


export const { changeExample } = exampleSlice.actions
export default exampleSlice.reducer