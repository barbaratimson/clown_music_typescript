import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../Loader";
import Playlist from "../Playlist";
import Album from "../Album";
import {AlbumT} from "../../utils/types/types";
import {trackArrayWrap} from "../../utils/trackWrap";

const link = process.env.REACT_APP_YMAPI_LINK
const AlbumView = () => {
    const {albumId} = useParams()
    const [album,setAlbum] = useState<AlbumT>()
    const [isLoading,setIsLoading] = useState(true)
    const fetchPlaylistSongs = async (id:any) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/album/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setAlbum(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };


    useEffect(() => {
        fetchPlaylistSongs(albumId)
    }, [albumId]);

    // useEffect(() => {
    //     const formattedVolumes = album?.volumes.map((volume)=>{
    //         return trackArrayWrap(volume)
    //     })
    //     setAlbum({...album,volumes:formattedVolumes})
    // }, [album]);

    if (isLoading) return <Loader />
    return (
        <>
            {album ? (
                <Album album={album}/>
            ) : null}
        </>
    )
}

export default AlbumView