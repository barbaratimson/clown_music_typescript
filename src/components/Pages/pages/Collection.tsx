import React, {useEffect, useState} from "react";
import axios from "axios";
import {PlaylistT, TrackT} from "../../../utils/types/types";
import Playlist from "../../Playlist";
import Loader from "../../Loader";
import SongsList from "../../SongsList";

const link = process.env.REACT_APP_YMAPI_LINK

const Collection = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [userTracks,setUserTracks] = useState<PlaylistT>()
    const fetchYaMusicSongs = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/myTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setUserTracks(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    useEffect(()=>{
        fetchYaMusicSongs()
    },[])

    if (isLoading) return <Loader />

    return (
            <div className="collection-wrapper">
                <div className="collection-title">Коллекция</div>
                <div className="collection-user-tracks"></div>
                {userTracks ? (
                    <SongsList playlist={userTracks}/>
                ) : null}
            </div>
    )
}

export default Collection