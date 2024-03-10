import React, {useEffect, useState} from "react";
import axios from "axios";
import {PlaylistT, TrackT} from "../../../utils/types/types";
import Playlist from "../../Playlist";
import Loader from "../../Loader";
import SongsList from "../../SongsList";
import PlaylistCard from "../../PlaylistCard";

const link = process.env.REACT_APP_YMAPI_LINK

const Collection = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [userTracks,setUserTracks] = useState<PlaylistT>()
    const [userPlaylists,setUserPlaylists] = useState<Array<PlaylistT>>()
    const fetchUserPlaylists = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/playlists`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setUserPlaylists(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    const fetchYaMusicSongs = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/myTracks`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setUserTracks(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    useEffect(()=>{
        const a = async () => {
            setIsLoading(true)
            await fetchYaMusicSongs()
            await fetchUserPlaylists()
        }
        a().then(()=>{setIsLoading(false)})
    },[])


    if (isLoading) return <Loader />

    return (
            <div className="collection-wrapper animated-opacity">
                <div className="collection-title">Коллекция</div>
                <div className="collection-user-tracks"></div>
                {userTracks ? (
                    <PlaylistCard playlist={userTracks}/>
                ) : null}
                <div className="collection-user-playlists">
                {userPlaylists ? userPlaylists.map((playlist)=>(
                    <PlaylistCard playlist={playlist}/>
                    )
                ) : null}
                </div>
            </div>
    )
}

export default Collection