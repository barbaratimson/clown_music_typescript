import React, {useEffect} from "react";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {Fade, Modal} from "@mui/material";
import {hideMessage, showMessage} from "../../store/MessageSlice";
import Track from "../Track/Track";
import TrackCover from "../TrackCover";
import { Favorite, HeartBroken } from "@mui/icons-material";


const Message = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector((state:RootState)=> state.message.message)
    const hideMessageFunc = () => dispatch(hideMessage())

    useEffect(() => {
        const a = setTimeout(()=>{
            hideMessageFunc()
        },2000)
        return ()=>{clearInterval(a)}   
    }, [message.active]);

    if ((message.type === "trackLiked" || "trackDisliked") && message.track) {
        return (
            <Fade in={message.active} unmountOnExit>
                <div className="message-wrapper track">
                    <div className="message-cover-animation">
                        <div className="message-cover-animation-icon">{message.type === "trackLiked" ? <Favorite/> : <HeartBroken/>}</div>
                        <TrackCover coverUri={message.track.coverUri} size={"100x100"} imageSize="200x200"/>
                    </div>
                    <div className="message-track-title">{message.track.title}</div>
                </div>
            </Fade>
        ) 
    } else {
        return (
            <Fade in={message.active}>
                        <div className="message-wrapper">
                            <div>{message.message}</div>
                        </div>
            </Fade>
        )
    }
}

const MessageDefault = () => {
    return (
        <></>
    )
}

const MessageTrackLiked = () => {
    return (
        <></>
    )
}

export default Message