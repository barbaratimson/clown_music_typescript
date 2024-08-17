import React, {useEffect, useState} from "react";
import PlaylistCard from "../../PlaylistCard";
import Loader, { PageLoader } from "../../Loader";
import axios from "axios";
import {GeneratedPlaylistT} from "../../../utils/types/types";
import PageBlock from "../../PageBlock";
import { PlaylistsBlock } from "../../PlaylistsBlock";

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

    if (isLoading) return <PageLoader />

    return (
        <div className="page-default animated-opacity">
            {generatedPlaylists &&
                <PageBlock title="Daily playlists">
                    <PlaylistsBlock type="grid" playlists={generatedPlaylists?.map(playlist => playlist.data)}/>
                </PageBlock>
            }
        </div>
    )
}

export default Home