
import React from "react";
import {TrackT} from "../../utils/types/types";

interface SongsListProps {
    songs:Array<TrackT>
}
const SongsList = ({songs}:SongsListProps) => {

    return (
        <div className="songs-wrapper">
            {songs ? songs.map((song) => (
                <div className="track-wrapper" key={song.id}>
                    {song.track?.title}
                </div>
            )) : null}
        </div>
    )
}

export default SongsList