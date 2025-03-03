import React, {useEffect, useState} from "react";
import axios from "axios";
import { PlaylistT } from "../../../utils/types/types";
import Loader from "../../UI/Loader";
import PlaylistCard from "../../PlaylistCard";
import PageHeader from "../../UI/PageHeader";
import PageBlock from "../../PageBlock";
import {Add} from "@mui/icons-material";
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import {cmLink, createCmPlaylist, fetchCmUserPlaylists, getCMImageUrl} from "../../../utils/cmApiRequsts";


const Collection = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(false)
    const [userPlaylists, setUserPlaylists] = useState<Array<PlaylistT>>([])
    const userData = useAppSelector((state:RootState)=> state.user.user)

    useEffect(() => {
        const a = async () => {
            setIsLoading(true)
            console.log(await fetchCmUserPlaylists(userData.id))
            await fetchCmUserPlaylists(userData.id).then(data => setUserPlaylists(data))
        }
        a().then(() => { setIsLoading(false) })
    }, [])


    if (isLoading) return <Loader.PageLoader />
    return (
        <div className="page-default animated-opacity">
            <PageHeader titleText="Collection" descText="Your music" src="https://avatars.yandex.net/get-music-user-playlist/30088/playlist-favorite-default/1000x1000"/>
            <PageBlock title="Playlists" controls={<div onClick={()=>{createCmPlaylist("abboba")}}><Add fontSize="large"/></div>}>
                {!isPlaylistsLoading ? (
                    <div className="playlists-wrapper-flex">
                    <PlaylistCard type="line" key={3} title="Мне нравится" coverUri="avatars.yandex.net/get-music-user-playlist/30088/playlist-favorite-default/" link={`/users/${userData.id}/playlist/3`} />
                        {userPlaylists ? userPlaylists.map((playlist) =>  (
                            <PlaylistCard type="line" key={playlist.id} coverUri={getCMImageUrl(playlist.cover?.id, "400x400")} title={playlist.name} link={`/users/${playlist.owner.id}/playlist/${playlist.id}`} />
                        )) : null}
                    </div>
                ): <Loader height={400} size={100}/>}
            </PageBlock>
        </div>

    )
}

export default Collection