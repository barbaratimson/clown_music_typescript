
import React from "react";
import {TrackType} from "../../utils/types/types";
import Track from "../Track/Track";

interface SongsListProps {
    songs: Array<TrackType>
}
const SongsList = ({songs}:SongsListProps) => {

    return (
        <div className="songs-wrapper">
            {songs ? songs.map((song) => (
                <Track key={song.id} track={song}/>
            )) : null}
        </div>
    )
}

export default SongsList