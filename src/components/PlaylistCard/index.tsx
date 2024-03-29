import React from "react";
import { Link } from "react-router-dom";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";

interface PlaylistCardProps {
    playlist: PlaylistT
}

const PlaylistCard = ({playlist}:PlaylistCardProps) => {

    return (
            <div key={playlist.kind} className="playlist-card-wrapper">
        <Link style = {{textDecoration:"none"}} to={`/users/${playlist.owner.uid}/playlist/${playlist.kind}`}>
                <div className="playlist-card-image">
                    <img src={getImageLink(playlist.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                </div>
                <div className="playlist-card-title">
                    {playlist.title}
                </div>
        </Link>
            </div>
    )
}

export default PlaylistCard