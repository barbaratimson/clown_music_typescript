
import React from "react";
import {CircularProgress} from "@mui/material";
import {ArtistT} from "../../utils/types/types";
import {Link} from "react-router-dom";

interface ArtistNameProps {
    artist: ArtistT,
    size: "15px" | "12px"
}

const ArtistName = ({artist,size}:ArtistNameProps) => {

    return (
        <Link className="track-info-artist" style = {{fontSize:size,textDecoration:"none"}} to={`/artist/${artist.id}`}>{artist.name}</Link>
    )
}

export default ArtistName