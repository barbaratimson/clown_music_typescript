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
    const currentQueueId = useAppSelector((state: RootState) => state.playingQueue.queue.id)
    const setPlayingQueue = (queue: QueueT) => dispatch(setQueue(queue))

    //TODO: Queue changing with filters dont work
    return (
        <div className="songs-wrapper">
            {tracks ? tracks.map((song) => song.track.available ? (
                <div onClick={()=>{if (currentQueueId !== playlistId) setPlayingQueue({id:playlistId,queueTracks:tracks})}}>
                    <Track key={song.id} track={song.track}/>
                </div>
            ): null) : null}
        </div>
    )
})

export default SongsList