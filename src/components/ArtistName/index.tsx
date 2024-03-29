
import React from "react";
import {CircularProgress} from "@mui/material";
import {ArtistT} from "../../utils/types/types";
import {Link} from "react-router-dom";

interface ArtistNameProps {
    artist: ArtistT
}

const ArtistName = ({artist}:ArtistNameProps) => {

    return (
        <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}> <div className="track-info-artist">{artist.name}</div></Link>
    )
}

export default ArtistName