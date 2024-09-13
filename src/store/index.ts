import { configureStore } from "@reduxjs/toolkit";
import CurrentSongSlice from "./CurrentSongSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import playerSlice from "../components/Player/playerSlice";
import playingQueueSlice from "./playingQueueSlice";
import LikedSongsSlice from "./LikedSongsSlice";
import MessageSlice from "./MessageSlice";
import mobileHeaderSlice from "./mobile/mobileHeaderSlice";
import CurrentPlaylistSlice from "./CurrentPlaylistSlice";
import trackInfoSlice from "./trackInfoSlice";
import devLogSlice from "./devLogSlice"
import playlistInfoSlice from "./playlistInfoSlice";
import userSlice from "../components/Pages/User/userSlice";

export const store = configureStore({
    reducer:{
        CurrentSongStore:CurrentSongSlice,
        player:playerSlice,
        playingQueue:playingQueueSlice,
        currentPlaylist:CurrentPlaylistSlice,
        message:MessageSlice,
        likedSongs:LikedSongsSlice,
        header:mobileHeaderSlice,
        trackInfo:trackInfoSlice,
        devLog: devLogSlice,
        playlistInfo: playlistInfoSlice,
        user: userSlice
    }
});

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch