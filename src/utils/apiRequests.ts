
import axios, { AxiosError } from "axios";
import {TrackId, TrackT} from "./types/types";
import { MessageType, showMessage } from "../store/MessageSlice";
import { store, useAppDispatch } from "../store";
const link = process.env.REACT_APP_YMAPI_LINK
const setMessage = (message:string,type:MessageType) => store.dispatch(showMessage({message:message,type:type}))
export const fetchYaSongLink = async (id:string | number) => {
    try {
        const response = await axios.get(
            `${link}/ya/tracks/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data
    } catch (err:any) {
        setMessage(err.message,"error")
    }
};

export const fetchLikedSongs = async () => {
    try {
        const response = await axios.get(
            `${link}/ya/likedTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data.library.tracks
    } catch (err:any) {
        setMessage(err.message,"error")
    }
};

export const likeSong = async (song:TrackT) => {
    try {
        const response = await axios.post(
            `${link}/ya/likeTracks/${song.id}`,null,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        // showMessageFunc(`"${song.title}" added to Liked`)
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};

export const dislikeSong = async (song:TrackT) => {
    try {
        const response = await axios.post(
            `${link}/ya/dislikeTracks/${song.id}`,null,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        // showMessageFunc(`"${song.title}" removed from Liked`)
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};