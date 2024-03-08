
import React, {useEffect, useState} from "react";
import PlaylistCard from "../../PlaylistCard";
import Loader from "../../Loader";
import axios from "axios";
import {GeneratedPlaylistT, PlaylistT} from "../../../utils/types/types";
import Playlist from "../../Playlist";

const link = process.env.REACT_APP_YMAPI_LINK
const Home = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [generatedPlaylists,setGeneratedPlaylists] = useState<Array<GeneratedPlaylistT>>()
    const fetchFeedPlaylists = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/feed`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setGeneratedPlaylists(response.data.generatedPlaylists)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };

    useEffect(() => {
        fetchFeedPlaylists()
    }, []);

    if (isLoading) return <Loader />

    return (
        <>
                {generatedPlaylists ? generatedPlaylists.map((playlist) => (
                    <Playlist playlist={playlist.data}/>
                )) : null}
        </>
    )
}

export default Home