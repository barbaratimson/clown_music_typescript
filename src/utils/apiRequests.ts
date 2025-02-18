
import axios, { AxiosError } from "axios";
import {TrackId, TrackT} from "./types/types";
import { MessageType } from "../store/MessageSlice";
import { store} from "../store";
import { logMessage } from "../store/devLogSlice";
import {showMessage} from "../store/MessageSlice";
const link = process.env.REACT_APP_YMAPI_LINK
const setMessage = (message:string,type:MessageType) => store.dispatch(showMessage({message:message,type:type}))
const devLog = (message:string) => store.dispatch(logMessage(message))
export const fetchYaSongLink = async (id:string | number) => {
    if (!id && id === 0) throw new Error ("Id null or undefined")
    try {
        const response = await axios.get(
            `${link}/ya/tracks/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data
    } catch (err:any) {
        setMessage(err.message,"error")
        devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
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


export const fetchSimilarTracks = async (id: any) => {
    try {
        const response = await axios.get(
            `${link}/ya/tracks/${id}/similar`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};

export const fetchUserPlaylists = async () => {
    try {
        const response = await axios.get(
            `${link}/ya/playlists`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
};


export const addToPlaylist = async (playlistId: number | string, track: TrackT, revision: number) => {
    try {
        const response = await axios.get(
            `${link}/ya/playlist/${playlistId}/add`, { params: { tracks: [{ id: track.id, albumId: track.albums[0].id }], revision: revision }, headers: { "Authorization": localStorage.getItem("Authorization") } });
        return `Track ${track.title} added to playlist`
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};

export const fetchArtist = async (artistId: string) => {
    try {
        const response = await axios.get(
            `${link}/ya/artist/${artistId}`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
};

export const fetchChart = async () => {
    try {
        const response = await axios.get(
            `${link}/ya/chart`,{ headers: { "Authorization": localStorage.getItem("Authorization") } });
        return response.data
    } catch (err: any) {
        console.error('Ошибка при получении чарта:', err);
    }
};

export const fetchAlbum = async (id:any) => {
    try {
        const response = await axios.get(
            `${link}/ya/album/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data
    } catch (err) {
        console.error('Ошибка при получении альбома:', err);
    }
};

