import React from "react";
import { Link } from "react-router-dom";
import {AlbumT, EmptyAlbumT, PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";

interface AlbumCardProps {
    album: AlbumT | EmptyAlbumT
}

const PlaylistCard = ({album}:AlbumCardProps) => {

    return (
        <div key={album.id} className="playlist-card-wrapper">
            <Link style = {{textDecoration:"none",width:"fit-content"}} to={`/artist/${album.artists[0].id}/album/${album.id}`}>
                <div className="playlist-card-image">
                    <img src={getImageLink(album.coverUri, "600x600") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                </div>
                <div className="playlist-card-title-wrapper">
                <div className="playlist-card-title">
                    {album.title}
                </div>
                </div>
            </Link>
        </div>
    )
}

export default PlaylistCard