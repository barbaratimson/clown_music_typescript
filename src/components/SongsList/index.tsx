import React, {memo, useEffect, useState} from "react";
import {QueueT, TrackType} from "../../utils/types/types";
import Track from "../Track/Track";
import {setQueue} from "../../store/playingQueueSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../store";

interface SongsListProps {
    tracks: Array<TrackType>
    playlistId: number | string
}

const SongsList = (({tracks,playlistId}:SongsListProps) => {
    const dispatch = useAppDispatch()
    const setPlayingQueue = (queue: QueueT) => dispatch(setQueue(queue))
    return (
        <div className="songs-wrapper">
            {tracks ? tracks.map((song) => song.track.available ? (
                <div onClick={()=>{setPlayingQueue({id:playlistId,queueTracks:tracks})}}>
                    <Track key={song.id} track={song.track}/>
                </div>
            ): null) : null}
        </div>
    )
})

export default SongsList