import React, {useEffect} from "react";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {Fade} from "@mui/material";
import {hideMessage} from "../../store/MessageSlice";
import Cover from "../Cover";
import {Favorite, HeartBroken} from "@mui/icons-material";
import './style.scss'
import ArtistName from "../ArtistName";
import {PositionInChart} from "../Track";

const Message = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector((state: RootState) => state.message.message)
    const hideMessageFunc = () => dispatch(hideMessage())

    useEffect(() => {
        const a = setTimeout(() => {
            hideMessageFunc()
        }, 2000)
        return () => { clearInterval(a) }
    }, [message.active]);

    if ((message.type === "trackLiked" || "trackDisliked") && message.track) {
        return (
            <Fade in={message.active} unmountOnExit>
                <div className="message-wrapper track">
                    <div className="message-cover-animation">
                        <div className={`message-cover-animation-icon`}>{message.type === "trackLiked" ? <Favorite /> : <HeartBroken />}</div>
                        <Cover coverUri={message.track.coverUri} size={"50x50"} imageSize="50x50" />
                    </div>
                    <div className="track-info-wrapper">
                        <div className="track-info-title-wrapper">
                            {message.track.chart && <PositionInChart position={message.track.chart.position}/>}
                            <div className="track-info-title">{message.track.title + `${message.track.version ? ` (${message.track.version})` : ""}`}</div>
                        </div>
                        <div onClick={(e)=>{e.stopPropagation()}} className="track-info-artists-wrapper">
                        <span className="track-info-artist-span">
                            {message.track.artists.map(artist => (
                                <ArtistName key={artist.id} artist={artist}/>
                            ))}
                        </span>
                        </div>
                    </div>
                </div>
            </Fade>
        )
    } else {
        return (
            <Fade in={message.active}>
                <div className="message-wrapper">
                    <div className="message-text-message">{message.message}</div>
                </div>
            </Fade>
        )
    }
}

export default Message