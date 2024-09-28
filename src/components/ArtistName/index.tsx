import React from "react";
import {ArtistT} from "../../utils/types/types";
import {Link} from "react-router-dom";
import "./style.scss"

interface ArtistNameProps {
    artist: ArtistT,
    size?: "15px" | "12px" | "14px"
}

const ArtistName = ({artist,size}:ArtistNameProps) => {

    return (
        <Link className="track-info-artist" style = {{fontSize:size,textDecoration:"none"}} to={`/artist/${artist.id}`}>{artist.name}</Link>
    )
}

export default ArtistName