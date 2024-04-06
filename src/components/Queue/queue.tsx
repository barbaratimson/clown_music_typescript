
import React, {useEffect, useState} from "react";
import {RootState, useAppSelector} from "../../store";
import Track from "../Track/Track";
import SongsList from "../SongsList";


const Queue = () => {
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue)
    return (
        <div className="queue-wrapper">
            <div className="queue-title">Current queue</div>
            <div className="queue-tracks">
                {currentQueue ? (
                    <SongsList tracks={currentQueue}/>
                ):null}
            </div>
            <div className="queue-controls">SETTINGS</div>
        </div>
    )
}

export default Queue