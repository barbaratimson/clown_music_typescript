
import React, {useEffect, useState} from "react";
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import Track from "../../Track/Track";
import SongsList from "../../SongsList";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {ExpandLess, ExpandMore, KeyboardArrowDown, Repeat} from "@mui/icons-material";
import { setQueue } from "../../../store/playingQueueSlice";
import { TrackDefaultT } from "../../../utils/types/types";
import { trackWrap } from "../../../utils/trackWrap";
import {Collapse, Fade, Slide} from "@mui/material";
import {useLocation, useSearchParams} from "react-router-dom";
import {getImageLink} from "../../../utils/utils";

interface QueueMobileProps {
    active : boolean,
    setActive : Function
}

const QueueMobile = ({active, setActive}:QueueMobileProps) => {
    const location = useLocation()
    const currentQueue = useAppSelector((state: RootState) => state.playingQueue.queue)
    const playerState = useAppSelector((state: RootState) => state.player)

    useEffect(()=>{
        setActive(false)
      },[location])

    return (
        <Slide direction={"up"} in={active}>
            <div className="queue-mobile" onClick={()=>{setActive(false)}}>
                <div className="queue-mobile-header animated-opacity-4ms">
                    <div className="track-info-mobile-cover-wrapper">
                        <img src={getImageLink(currentQueue.playlist.cover.uri, "200x200")} loading="lazy" alt=""/>
                    </div>
                    <div className="track-info-wrapper">
                        <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title mobile">{currentQueue.playlist.title}</div>
                    </div>
                    <div className="track-info-back-button">
                        <ExpandMore/>
                    </div>
                </div>
            <div className={`queue-tracks ${playerState.repeat ? "queue-tracks-repeat" : null}`} onClick={(e)=>{e.stopPropagation()}}>
                <div className="songs-wrapper">
                    {currentQueue ? currentQueue.queueTracks.map((song) => (
                            <Track key={song.id} track={song.track}/>
                    )) : null}
                </div>
            </div>
        </div>
        </Slide>
    )
}

export default QueueMobile