import React, {useEffect, useState} from "react";
import PlaylistCard from "../../PlaylistCard";
import Loader from "../../Loader";
import axios from "axios";
import {GeneratedPlaylistT} from "../../../utils/types/types";

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
            <div className="playlists-wrapper">
                {generatedPlaylists ? generatedPlaylists.map((playlist) => (
                    <PlaylistCard playlist={playlist.data}/>
                )) : null}
            </div>
        </>
    )
}

export default Home