
import {MessageType, showMessage} from "../store/MessageSlice";
import {store} from "../store";
import {logMessage} from "../store/devLogSlice";
import axios from "axios";
import {TrackT} from "./types/types";

export const cmLink = process.env.REACT_APP_CMAPI_LINK

const setMessage = (message:string,type:MessageType) => store.dispatch(showMessage({message:message,type:type}))
const devLog = (message:string) => store.dispatch(logMessage(message))
export const fetchCMSongLink = async (id:string | number) => {
    if (!id && id === 0) throw new Error ("Id null or undefined")
    try {
        const response = await axios.get<string>(
            `${cmLink}/track/audio/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err:any) {
        setMessage(err.message,"error")
        devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};

export const fetchCmUser = async () => {
    try {
        const response = await axios.get(
            `${cmLink}/user`,{headers:{"Authorization":localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err:any) {
        setMessage(err.message,"error")
        devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};


export function getCMImageUrl(id:string | undefined, size:string) {
    if (id && size) {
        return `${cmLink}/cover/${id}?size=${size}`
    } else {
        return ""
    }
}


export const fetchCmArtists = async () => {
    try {
        const response = await axios.get(
            `${cmLink}/artist`, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err: any) {
        // setMessage(err.message,"error")
        // devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};

export const fetchCmArtistById = async (id:string) => {
    try {
        const response = await axios.get(
            `${cmLink}/artist/${id}`, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err: any) {
        // setMessage(err.message,"error")
        // devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};

export const fetchCmAlbumById = async (id:string | undefined) => {
    if (!id) throw new Error("No id provided")
    try {
        const response = await axios.get(
            `${cmLink}/album/${id}`, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err: any) {
        // setMessage(err.message,"error")
        // devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};

export const fetchCmUserTracks = async () => {
    try {
        const response = await axios.get(
            `${cmLink}/track/users/1`, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err: any) {
        // setMessage(err.message,"error")
        // devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};

export const fetchCmUserPlaylists = async (id:number | string) => {
    if (!id) return
    try {
        const response = await axios.get(
            `${cmLink}/playlist/users/${id}`, { headers: { "Authorization": localStorage.getItem("Authorization_CM") } });
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
};

export const createCmPlaylist = async (name:string) => {
    try {
        const response = await axios.post(
            `${cmLink}/playlist`, { data:{name: name},headers: { "Authorization": localStorage.getItem("Authorization_CM") } });
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
}

export const addToCmPlaylist = async (id:string | number, tracks:TrackT[]) => {
    try {
        const response = await axios.post(
            `${cmLink}/playlist/${id}/add-tracks`, {tracks: tracks}, {headers: { "Authorization": localStorage.getItem("Authorization_CM") }} );
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
}


export const fetchRecentTracks = async () => {
    try {
        const response = await axios.get(
            `${cmLink}/track/recent`, {headers: { "Authorization": localStorage.getItem("Authorization_CM") }} );
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
}

export const deleteTrack = async (id:number) => {
    try {
        const response = await axios.delete(
            `${cmLink}/track/${id}`,{headers: { "Authorization": localStorage.getItem("Authorization_CM") }} );
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
    }
}






