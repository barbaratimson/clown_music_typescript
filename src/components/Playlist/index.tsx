import React, {useEffect, useRef, useState} from "react";
import {PlaylistT} from "../../utils/types/types";
import { getImageLink } from "../../utils/utils";
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
            <SongsList songs={playlist.tracks}/>
        </div>
    )
}

export default Playlist