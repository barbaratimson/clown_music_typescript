import { createSlice } from "@reduxjs/toolkit"
interface DevLogT {
  log:string
}

const initialState:DevLogT = {log:""}

const DevLog = createSlice({
    name:"DevLog",
    initialState,
    reducers:{
       logMessage(state,action){
         const date = new Date
          state.log = state.log + `\n -- ${date}: "${action.payload}",`
       }
    }
})

export const { logMessage } = DevLog.actions
export default DevLog.reducer