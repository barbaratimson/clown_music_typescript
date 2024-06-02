import React, {memo, useEffect, useState} from "react";
import {PlaylistT, QueueT, TrackType} from "../../utils/types/types";
import Track from "../Track/Track";
import {initQueue} from "../../store/playingQueueSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import { setCurrentPlaylist } from "../../store/CurrentPlaylistSlice";

interface SongsListProps {
    tracks: Array<TrackType>
    playlist: PlaylistT
}

const SongsList = (({tracks,playlist}:SongsListProps) => {
    const dispatch = useAppDispatch()
    const setPlayingQueue = (queue: QueueT) => dispatch(initQueue(queue))
    return (
        <div className="songs-wrapper">
            {tracks ? tracks.map((song) => song.track.available ? (
                <div onClick={()=>{setPlayingQueue({playlist:playlist,queueTracks:playlist.tracks})}}>
                    <Track key={song.id} track={song.track}/>
                </div>
            ): null) : null}
        </div>
    )
})

export default SongsList