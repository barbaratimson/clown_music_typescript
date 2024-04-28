
import axios from "axios";
import {TrackId, TrackT} from "./types/types";
const link = process.env.REACT_APP_YMAPI_LINK

export const fetchYaSongLink = async (id:string | number) => {
    try {
        const response = await axios.get(
            `${link}/ya/tracks/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};

export const fetchLikedSongs = async () => {
    try {
        const response = await axios.get(
            `${link}/ya/likedTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data.library.tracks
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
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