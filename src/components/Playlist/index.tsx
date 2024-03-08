import React, {useEffect, useRef, useState} from "react";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";
import SongsList from "../SongsList";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {setQueue} from "../../store/playingQueueSlice";
import axios from "axios";
import Loader from "../Loader";

interface PlaylistProps {
    playlist: PlaylistT | any
}

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({playlist}: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const playlistInfo = useRef(null)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const setPlayingQueue = (playlist: PlaylistT) => dispatch(setQueue(playlist.tracks))
    const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistT>()
    const [playlistTracks, setPlaylistTracks] = useState(playlist.tracks)
    const [playlistState,setPlaylist] = useState(playlist)
    const [isLoading,setIsLoading] = useState(true)


    const fetchPlaylistSongs = async (userId:number,kind:number) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/playlist/tracks/${userId}/${kind}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setPlaylistTracks(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };

    useEffect(() => {
        const a = async () => {
            await fetchPlaylistSongs(playlist.kind,playlist.owner.uid)
        }
        a()
    }, []);

    if (isLoading) return  <Loader/>
    return (
        <div className="playlist-wrapper animated-opacity">
            <div ref={playlistInfo} className="playlist">
                <div className="playlist-cover-wrapper">
                    <img src={getImageLink(playlist.cover.uri, "200x200")} alt="" loading="lazy"/>
                </div>
                <div className="playlist-info-wrapper">
                    <div className="playlist-info-title">
                        {playlist.title}
                    </div>
                    <div className="playlist-info-desc">
                        {playlist.description}
                    </div>
                </div>
            </div>
            <SongsList playlist={{...playlist,tracks:playlistTracks}}/>
        </div>
    )
}

export default Playlist