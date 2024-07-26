
import React, {useEffect, useState} from "react";
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import Track from "../../Track/Track";
import SongsList from "../../SongsList";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Repeat } from "@mui/icons-material";
import { setQueue } from "../../../store/playingQueueSlice";
import { TrackDefaultT } from "../../../utils/types/types";
import { trackWrap } from "../../../utils/trackWrap";
import { Collapse, Slide } from "@mui/material";

interface QueueMobileProps {
    active : boolean,
    setActive : Function
}

const QueueMobile = ({active, setActive}:QueueMobileProps) => {
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue)
    const playerState = useAppSelector((state: RootState) => state.player)

    return (
        <Collapse orientation={"vertical"} in={active}>
                    <div className="player-wrapper-full" onClick={()=>{setActive(false)}} style={{marginBottom: "49px"}}>
            <div className="queue-title">Current queue</div>
            <div className={`queue-tracks ${playerState.repeat ? "queue-tracks-repeat" : null}`}>
                <div className="songs-wrapper">
                    {currentQueue ? currentQueue.queueTracks.map((song) => (
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
        </Collapse>
    )
}

export default QueueMobile