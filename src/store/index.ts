import { configureStore } from "@reduxjs/toolkit";
import exampleSlice from "./SliceExample";
import CurrentSongSlice from "./CurrentSongSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import playerSlice from "./PlayerSlice";

// TODO: Middleware сомнительно но окэй
export const store = configureStore({
    reducer:{
        exampleStore:exampleSlice,
        CurrentSongStore:CurrentSongSlice,
        player:playerSlice
    }
});

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch