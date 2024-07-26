import Player from "../Player";
import React, {useEffect, useState} from "react";
import Navbar from "../Navbar";
import Page from "../Pages";
import Message from "../Message";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {TrackId, TrackT} from "../../utils/types/types";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {fetchLikedSongs} from "../../utils/apiRequests";
import {userId} from "../../utils/constants";
import Queue from "../Queue/queue";
import {
    deviceState,
    getIsDesktop,
    getIsMobile,
    handleSubscribe,
    offSubscribe,
    onSubscribe
} from "../../utils/deviceHandler";
import NavbarMobile from "../Navbar/NavbarMobile";
import PlayerMobile from "../Player/PlayerMobile";
import MobileHeader from "../MobileHeader";
import {Fade} from "@mui/material";
import {setActiveState, setTrackInfo} from "../../store/trackInfoSlice";
import MobileTrackInfo from "../MobileTrackInfo";
import QueueMobile from "../Queue/QueueMobile";
import {setOpeningState} from "../../store/playingQueueSlice";


const Main = () => {
    const dispatch = useAppDispatch()
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    const setQueueOpen = (open:boolean) => dispatch(setOpeningState(open))
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        async function fetchData () {
            setLikedSongsData( await fetchLikedSongs())
        }
        fetchData()
        const getIsMobileInfo = () => {
            handleSubscribe()
            onSubscribe()
            setIsMobile(getIsMobile(deviceState))
            console.log(getIsMobile(deviceState))
        }
        getIsMobileInfo()

    }, []);

    return (
            <div className="main-wrapper">
                {isMobile && <MobileHeader/>}
                {!isMobile ? (<Navbar/>) : (<NavbarMobile/>)}
                <Page isMobile={isMobile}/>
                {!isMobile ? (<Player/>) : (<PlayerMobile/>)}
                <Message/>
                {!isMobile ? (
                    <>
                    <Fade in={queueOpen} unmountOnExit>
                    <div className="player-queue-section">
                        <Queue/>
                    </div>
                    </Fade>
                    </>
                ) : (<QueueMobile active={queueOpen ?? false} setActive={setQueueOpen}/>)}

                <MobileTrackInfo/>
            </div>
    )
}

export default Main