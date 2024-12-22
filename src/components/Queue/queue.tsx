import React from "react";
import {RootState, useAppSelector} from "../../store";
import Index from "../Track";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {Repeat} from "@mui/icons-material";
import Cover from "../UI/Cover";

const Queue = () => {
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue)
    const playerState = useAppSelector((state: RootState) => state.player)

    return (
        <div className="queue-wrapper">
            <div className="queue-mobile-header animated-opacity-4ms">
                <Cover coverUri={currentQueue.playlist.cover.uri} size="75x75" imageSize="100x100"/>
                <div className="track-info-wrapper">
                    <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title mobile">{currentQueue.playlist.title}</div>
                </div>
            </div>
            <div className={`queue-tracks ${playerState.repeat ? "queue-tracks-repeat" : null}`}>
                <div className="songs-wrapper">
                    {currentQueue ? currentQueue.queueTracks.map((song) => (
                            <Index key={song.id} track={song.track}/>
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