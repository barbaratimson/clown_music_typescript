
import React from "react";
import {PlaylistT, TrackT, TrackType} from "../../utils/types/types";
import Track from "../Track/Track";
import {setQueue} from "../../store/playingQueueSlice";
import {useAppDispatch} from "../../store";



interface SongsListProps {
    tracks: Array<TrackType>
    changeCurrentQueue?:Function
}

const SongsList = ({tracks,changeCurrentQueue}:SongsListProps) => {
    return (
        <div className="songs-wrapper">
            {tracks ? tracks.map((song) => (
                <div onClick={()=>{changeCurrentQueue && changeCurrentQueue()}}>
                    <Track key={song.id} track={song.track}/>
                </div>
            )) : null}
        </div>
    )
}


export default SongsList