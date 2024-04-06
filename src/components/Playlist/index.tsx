import React, {useRef, useState} from "react";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";
import SongsList from "../SongsList";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {setQueue} from "../../store/playingQueueSlice";

interface PlaylistProps {
    playlist: PlaylistT | any
}

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({playlist}: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const playlistInfo = useRef(null)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const setPlayingQueue = (playlist: PlaylistT) => dispatch(setQueue(playlist))
    const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistT>()
    const [playlistTracks, setPlaylistTracks] = useState(playlist)
    const [playlistState,setPlaylist] = useState(playlist)

    return (
        <div className="playlist-wrapper animated-opacity">
            <div ref={playlistInfo} className="playlist">
                <div className="playlist-cover-wrapper">
                    <img src={getImageLink(playlist.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
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
            <SongsList changeCurrentQueue={()=>{setPlayingQueue(playlist)}} tracks={playlist.tracks}/>
        </div>
    )
}

export default Playlist