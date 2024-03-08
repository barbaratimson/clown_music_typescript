import React from "react";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";

interface PlaylistCardProps {
    playlist: PlaylistT
}

const PlaylistCard = ({playlist}:PlaylistCardProps) => {

    return (
        <div className="playlist-card-wrapper">
            <div className="playlist-card-image">
                <img src={getImageLink(playlist.cover.uri, "200x200")} alt="" loading="lazy"/>
            </div>
            <div className="playlist-card-title">
                {playlist.title}
            </div>
        </div>
    )
}

export default PlaylistCard