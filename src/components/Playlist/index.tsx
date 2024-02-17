
import React from "react";
import {PlaylistT} from "../../utils/types/types";
import SongsList from "../SongsList";

interface PlaylistProps {
    playlist:PlaylistT
}
const Playlist = ({playlist}:PlaylistProps) => {

    return (
        <>
            <SongsList songs={playlist?.tracks}/>
        </>
    )
}

export default Playlist