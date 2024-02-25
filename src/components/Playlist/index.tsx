import React, {useEffect, useRef, useState} from "react";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";
import SongsList from "../SongsList";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {setQueue} from "../../store/playingQueueSlice";

interface PlaylistProps {
    playlist: PlaylistT
}

const Playlist = ({playlist}: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const playlistCard = useRef(null)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const setPlayingQueue = (playlist: PlaylistT) => dispatch(setQueue(playlist.tracks))
    const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistT>()


    return (
        <div className="playlist-wrapper">
            <div ref={playlistCard} className="playlist-card">
                <div className="playlist-card-cover-wrapper">
                    <img src={getImageLink(playlist.cover.uri, "200x200")} alt="" loading="lazy"/>
                </div>
                <div className="playlist-card-info-wrapper">
                    <div className="playlist-card-info-title">
                        {playlist.title}
                    </div>
                    <div className="playlist-card-info-desc">
                        {playlist.description}
                    </div>
                </div>
            </div>
            <SongsList playlist={playlist}/>
        </div>
    )
}

export default Playlist