import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlaylistT } from "../../../utils/types/types";
import Loader from "../../Loader";
import PlaylistCard from "../../PlaylistCard";
import { getImageLink } from "../../../utils/utils";
import { Link } from "react-router-dom";
import PageHeader from "../../PageHeader";


const link = process.env.REACT_APP_YMAPI_LINK
const Collection = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [userTracks, setUserTracks] = useState<PlaylistT>()
    const [userPlaylists, setUserPlaylists] = useState<Array<PlaylistT>>()
    const [userData, setUserData] = useState<any>()
    const fetchUserPlaylists = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/playlists`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setUserPlaylists(response.data)
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

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/user`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setUserData(response.data)
            console.log(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    useEffect(() => {
        const a = async () => {
            setIsLoading(true)
            await fetchYaMusicSongs()
            await fetchUserPlaylists()
            await fetchUser()
        }
        a().then(() => { setIsLoading(false) })
    }, [])


    if (isLoading) return <Loader />

    return (
            <div className="page-default animated-opacity">
                <PageHeader titleText="Коллекция" descText="Ваша музыка" coverUri="avatars.yandex.net/get-music-user-playlist/30088/playlist-favorite-default/" />
                <div className="collection-user-playlists-wrapper">
                    <div className="collection-title">Плейлисты</div>
                    <div className="playlists-wrapper">
                        <Link style={{ textDecoration: "none", width: "fit-content" }} to={`/users/${userData.account.uid}/playlist/3`}>
                            <div className="playlist-card-wrapper">
                                <div className="playlist-card-image">
                                    <img src={"http://avatars.yandex.net/get-music-user-playlist/30088/playlist-favorite-default/600x600"} alt="" loading="lazy" />
                                </div>
                                <div className="playlist-card-title-wrapper">
                                    <div className="playlist-card-title">Favourites</div>
                                </div>
                            </div>
                        </Link>
                        {userPlaylists ? userPlaylists.map((playlist) => playlist.kind !== 0 ? (
                            <PlaylistCard playlist={playlist} />
                        ) : null
                        ) : null}
                    </div>
                </div>
            </div>

    )
}

export default Collection