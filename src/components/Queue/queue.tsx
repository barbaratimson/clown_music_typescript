import React from "react";
import {RootState, useAppSelector} from "../../store";
import Index from "../Track";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {Repeat} from "@mui/icons-material";
import Cover from "../UI/Cover";
import {getCMImageUrl} from "../../utils/cmApiRequsts";
import Track from "../Track";

const Queue = () => {
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue)
    const playerState = useAppSelector((state: RootState) => state.player)
    return (
        <div className="queue-wrapper">
            <div className="queue-mobile-header animated-opacity-4ms">
                <Cover src={getCMImageUrl(currentQueue.playlist.cover.id,"120x120")} size="75x75" imageSize="100x100"/>
                <div className="track-info-wrapper">
                    <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title mobile">{currentQueue.playlist.title}</div>
                </div>
            </div>
            <div className={`queue-tracks ${playerState.repeat ? "queue-tracks-repeat" : null}`}>
                <div className="songs-wrapper">
                    {currentQueue ? currentQueue.queueTracks.map((song) => (
                            <Track key={song.id} track={song}/>
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