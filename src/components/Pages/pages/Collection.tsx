import React, {useEffect, useState} from "react";
import axios from "axios";
import { PlaylistT } from "../../../utils/types/types";
import Loader from "../../Loader";
import PlaylistCard from "../../PlaylistCard";
import PageHeader from "../../PageHeader";
import PageBlock from "../../PageBlock";
import {Add} from "@mui/icons-material";
import { RootState, useAppSelector } from "../../../store";


const link = process.env.REACT_APP_YMAPI_LINK

const Collection = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(false)
    const [userTracks, setUserTracks] = useState<PlaylistT>()
    const [userPlaylists, setUserPlaylists] = useState<Array<PlaylistT>>()
    const userData = useAppSelector((state:RootState)=> state.user)
    
    const fetchUserPlaylists = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/playlists`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setUserPlaylists(response.data)
            setIsPlaylistsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    const fetchYaMusicSongs = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/myTracks`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setUserTracks(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    const createPlaylist = async (name:string) => {
        setIsPlaylistsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/playlist/create`, { params:{name, visibility: "public"},headers: { "Authorization": localStorage.getItem("Authorization") } });
            await fetchUserPlaylists()
            console.log(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    }


    useEffect(() => {
        const a = async () => {
            setIsLoading(true)
            await fetchYaMusicSongs()
            await fetchUserPlaylists()
        }
        a().then(() => { setIsLoading(false) })
    }, [])


    if (isLoading) return <Loader.PageLoader />
    return (
        <div className="page-default animated-opacity">
            <PageHeader titleText="Collection" descText="Your music" coverUri="avatars.yandex.net/get-music-user-playlist/30088/playlist-favorite-default/" />
            <PageBlock title="Playlists" controls={<div onClick={()=>{createPlaylist("abboba")}}><Add fontSize="large"/></div>}>
                {!isPlaylistsLoading ? (
                    <div className="playlists-wrapper-flex">
                    <PlaylistCard type="line" key={3} title="Мне нравится" coverUri="avatars.yandex.net/get-music-user-playlist/30088/playlist-favorite-default/" link={`/users/${userData.user?.account?.uid}/playlist/3`} />
                        {userPlaylists ? userPlaylists.map((playlist) => playlist.kind !== 0 ? (
                            <PlaylistCard type="line" key={playlist.kind} title={playlist.title} coverUri={playlist.ogImage} link={`/users/${playlist.owner.uid}/playlist/${playlist.kind}`} />
                        ) : null
                        ) : null}
                    </div>
                ): <Loader height={400} size={100}/>}
            </PageBlock>
        </div>

    )
}

export default Collection