import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../Loader";
import Playlist from "../Playlist";

const link = process.env.REACT_APP_YMAPI_LINK
const PlaylistView = () => {
    const {userId,playlistId} = useParams()
    const [playlistState,setPlaylist] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const fetchPlaylistSongs = async (userId:any,kind:any) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/playlist/tracks/${userId}/${kind}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setPlaylist(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };

    useEffect(() => {
        fetchPlaylistSongs(playlistId,userId)
    }, [playlistId]);

    if (isLoading) return <Loader.PageLoader />
    return (
        <>
            {playlistState ? (
                <Playlist playlist={playlistState}/>
                ): null
            }

        </>
    )
}

export default PlaylistView