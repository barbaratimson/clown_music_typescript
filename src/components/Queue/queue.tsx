
import React, {useEffect, useState} from "react";
import {RootState, useAppSelector} from "../../store";
import Track from "../Track/Track";
import SongsList from "../SongsList";
import ShuffleIcon from '@mui/icons-material/Shuffle';


const Queue = () => {
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue)
    return (
        <div className="queue-wrapper animated-opacity">
            <div className="queue-title">Current queue</div>
            <div className="queue-tracks">
                {currentQueue ? (
                    <SongsList tracks={currentQueue}/>
                ):null}
            </div>
            <div className="queue-controls">
                <ShuffleIcon/>
            </div>
        </div>
    )
}

export default Queue