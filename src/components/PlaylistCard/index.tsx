import React from "react";
import { Link } from "react-router-dom";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";

interface PlaylistCardProps {
    playlist: PlaylistT
}

const PlaylistCard = ({playlist}:PlaylistCardProps) => {

    return (
        <>
        <Link style = {{textDecoration:"none",width:"fit-content"}} to={`/users/${playlist.owner.uid}/playlist/${playlist.kind}`}>
            <div key={playlist.kind} className="playlist-card-wrapper">
                <div className="playlist-card-image">
                    <img src={getImageLink(playlist.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                </div>
                <div className="playlist-card-title-wrapper">
                    <div className="playlist-card-title">{playlist.title}</div>
                </div>
            </div>
        </Link>
        </>
    )
}

export default PlaylistCard