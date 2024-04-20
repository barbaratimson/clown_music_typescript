
import React, {useEffect, useState} from "react";
import {RootState, useAppSelector} from "../../store";
import Track from "../Track/Track";
import SongsList from "../SongsList";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Repeat } from "@mui/icons-material";

const Queue = () => {
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue.queueTracks)
    const playerState = useAppSelector((state: RootState) => state.player)
    return (
        <div className="queue-wrapper animated-opacity-2ms">
            <div className="queue-title">Current queue</div>
            <div className={`queue-tracks ${playerState.repeat ? "queue-tracks-repeat" : null}`}>
                <div className="songs-wrapper">
                    {currentQueue ? currentQueue.map((song) => (
                            <Track key={song.id} track={song.track}/>
                    )) : null}
                </div>
            </div>
                <div className="queue-controls">
            {playerState.shuffle ? (
                <div className = "queue-controls-shuffle">
                 <ShuffleIcon/>
                </div>
            ):null}
            {playerState.repeat ? (
                    <div className="queue-controls-repeat">
                        <Repeat/>
                    </div>
                ) : null}
                </div>

        </div>
    )
}

export default Queue