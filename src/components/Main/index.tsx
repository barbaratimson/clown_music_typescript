import Player from "../Player";
import React, {lazy, Suspense, useEffect, useState} from "react";
import Navbar from "../Navbar";
import Page from "../Pages";
import Message from "../Message";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {TrackId} from "../../utils/types/types";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {fetchLikedSongs} from "../../utils/apiRequests";
import {deviceState, getIsMobile, handleSubscribe, onSubscribe} from "../../utils/deviceHandler";
import NavbarMobile from "../Navbar/NavbarMobile";
import MobileHeader from "../MobileHeader";
import {Fade} from "@mui/material";
import MobileTrackInfo from "../TrackInfo/MobileTrackInfo";
import {setOpeningState} from "../../store/playingQueueSlice";
import MobilePlaylistInfo from "../PlaylistInfo/MobilePlaylistInfo";
import { UserT } from "../Pages/User/user.types";
import { setUser } from "../Pages/User/userSlice";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Queue from "../Queue/queue";
import Loader from "../Loader";
const QueueMobile = lazy(()=> import("../Queue/QueueMobile"))
const link = process.env.REACT_APP_YMAPI_LINK

const Main = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    const setQueueOpen = (open:boolean) => dispatch(setOpeningState(open))
    const [isMobile, setIsMobile] = useState(false)
    const setCurrentUser = (user:UserT) => dispatch(setUser(user))
    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/user`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setCurrentUser(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    
    useEffect(() => {
        async function fetchData () {
            setLikedSongsData( await fetchLikedSongs())
            fetchUser()
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
                <Player/>
                <Message/>
                {!isMobile ? (
                    <>
                    <Fade in={queueOpen} unmountOnExit>
                        <div className="player-queue-section">
                            <Queue/>
                        </div>
                    </Fade>
                    </>
                ) : (
                        <QueueMobile active={queueOpen ?? false} setActive={setQueueOpen}/>
                        )
                }
                {isMobile && <MobileTrackInfo/>}
                {isMobile && <MobilePlaylistInfo/>}
            </div>
    )
}

export default Main