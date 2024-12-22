import React, {Suspense, useEffect} from "react";
import {RootState, useAppSelector} from "../../../store";
import Index from "../../Track";
import {ExpandMore} from "@mui/icons-material";
import {Slide} from "@mui/material";
import {useLocation} from "react-router-dom";
import Cover from "../../UI/Cover";
import PopUpModal from "../../UI/PopUpModal";
import Loader from "../../UI/Loader";
import Track from "../../Track";
import SongsList from "../../SongsList";

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
        <PopUpModal active={active} setActive={setActive}>
            <div className="queue-mobile">
                <div className="queue-mobile-header">
                    <Cover coverUri={currentQueue.playlist.cover.uri} size="75x75" imageSize="100x100"/>
                    <div className="track-info-wrapper">
                        <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title mobile">{currentQueue.playlist.title}</div>
                        <div style={{ marginTop: "5px" }} className="track-info-artist">{currentQueue.queueTracks.length + " tracks"}</div>
                    </div>
                    <div className="track-info-back-button">
                        <ExpandMore/>
                    </div>
                </div>
            <div className={`queue-tracks ${playerState.repeat ? "queue-tracks-repeat" : null}`} onClick={(e)=>{e.stopPropagation()}}>
                   <SongsList tracks={currentQueue.queueTracks}></SongsList>
                    {/*<div className="songs-wrapper">*/}
                    {/*    {currentQueue ? currentQueue.queueTracks.map((song) => (*/}
                    {/*            <Track key={song.id} track={song.track}/>*/}
                    {/*    )) : null}*/}
                    {/*</div>*/}
            </div>
        </div>
        </PopUpModal>
    )
}

export default QueueMobile