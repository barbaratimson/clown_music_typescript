import { configureStore } from "@reduxjs/toolkit";
import CurrentSongSlice from "./CurrentSongSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import playerSlice from "./PlayerSlice";
import playingQueueSlice from "./playingQueueSlice";

export const store = configureStore({
    reducer:{
        CurrentSongStore:CurrentSongSlice,
        player:playerSlice,
        playingQueue:playingQueueSlice,
        currentPlaylist:CurrentSongSlice
    }
});

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch