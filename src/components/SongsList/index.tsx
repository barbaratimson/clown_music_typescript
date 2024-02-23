
import React from "react";
import {PlaylistT, TrackType} from "../../utils/types/types";
import Track from "../Track/Track";
import {setQueue} from "../../store/playingQueueSlice";
import {useAppDispatch} from "../../store";

interface SongsListProps {
    playlist: PlaylistT
}
const SongsList = ({playlist}:SongsListProps) => {
    const dispatch = useAppDispatch()
    const setPlayingQueue = (songs:PlaylistT) => dispatch(setQueue(songs))
    const changeCurrentQueue = () => {
        setPlayingQueue(playlist)
    }
    return (
        <div className="songs-wrapper">
            {playlist.tracks ? playlist.tracks.map((song) => (
                <div onClick={changeCurrentQueue}>
                <Track key={song.track.id} track={song}/>
                </div>
            )) : null}
        </div>
    )
}

export default SongsList