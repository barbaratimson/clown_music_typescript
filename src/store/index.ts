import { configureStore } from "@reduxjs/toolkit";
import exampleSlice from "./SliceExample";

export const store = configureStore({
    reducer:{
        exampleStore:exampleSlice
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch