
import {MessageType, showMessage} from "../store/MessageSlice";
import {store} from "../store";
import {logMessage} from "../store/devLogSlice";
import axios from "axios";

export const cmLink = process.env.REACT_APP_CMAPI_LINK

const setMessage = (message:string,type:MessageType) => store.dispatch(showMessage({message:message,type:type}))
const devLog = (message:string) => store.dispatch(logMessage(message))
export const fetchCMSongLink = async (id:string | number) => {
    if (!id && id === 0) throw new Error ("Id null or undefined")
    try {
        const response = await axios.get(
            `${cmLink}/track/audio/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization_CM")}});
        return response.data
    } catch (err:any) {
        setMessage(err.message,"error")
        devLog("error while fetching song link "+ err.code + err.message);
        console.log("Error while getting download link: " + err)
    }
};

export function getCMImageUrl(id:string, size:string) {
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

