import React, {useEffect, useRef, useState} from "react";
import {PlaylistT} from "../../utils/types/types";
import SongsList from "../SongsList";

interface PlaylistProps {
    playlist:PlaylistT
}
const Playlist = ({playlist}:PlaylistProps) => {
    const playlistCard = useRef(null)
    const [playlistCardHeightOffset, setPlaylistCardHeightOffset] = useState(0)
    const [playlistCardSticky, setPlaylistCardSticky] = useState(false)

    return (
        <div className="playlist-wrapper">
            <div ref={playlistCard} className="playlist-card"></div>
            <SongsList songs={playlist.tracks}/>
        </div>
    )
}

export default Playlist