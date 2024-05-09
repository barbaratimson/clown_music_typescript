import Player from "../Player";
import React, {useEffect} from "react";
import Navbar from "../Navbar";
import Page from "../Pages";
import Message from "../Message";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {TrackId} from "../../utils/types/types";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {fetchLikedSongs} from "../../utils/apiRequests";
import {userId} from "../../utils/constants";
import Queue from "../Queue/queue";


const Main = () => {
    const dispatch = useAppDispatch()
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    useEffect(() => {
        async function fetchData () {
            setLikedSongsData( await fetchLikedSongs())
        }
        fetchData()
    }, []);

    return (
            <div className="main-wrapper">
                <Navbar/>
                <Page />
                <Player/>
                <Message/>
                <div className="player-queue-section">
                    {queueOpen ? (
                        <Queue/>
                    ): null}
                </div>
            </div>
    )
}

export default Main