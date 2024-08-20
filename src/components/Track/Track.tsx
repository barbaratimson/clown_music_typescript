import React, {useEffect, useRef, useState} from "react";
import {TrackId, TrackT} from "../../utils/types/types";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop} from "../../store/PlayerSlice";
import {getImageLink, msToMinutesAndSeconds, secToMinutesAndSeconds} from "../../utils/utils";
import {ArrowDropDown, ArrowDropUp, Favorite, FavoriteBorder, HorizontalRule, MoreVert, PauseRounded, PlayArrowRounded, Remove} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";
import {dislikeSong, fetchLikedSongs, likeSong} from "../../utils/apiRequests";
import {userId} from "../../utils/constants";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {showMessage} from "../../store/MessageSlice";
import { trackWrap } from "../../utils/trackWrap";
import {setActiveState, setTrackInfo} from "../../store/trackInfoSlice";
import Cover, { ImagePlaceholder } from "../Cover";


interface TrackProps {
    track : TrackT,
    queueFunc?:Function
}

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({track,queueFunc}:TrackProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const trackAddedMessage = (message:string) => dispatch(showMessage({message:message}))
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const playerState = useAppSelector((state: RootState) => state.player)
    const setCurrentSong = (track:TrackT) =>dispatch(changeCurrentSong(track))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setTrackInfoState = (track:TrackT) => dispatch(setTrackInfo(track))
    const setTrackInfoShowState = (active:boolean) => dispatch(setActiveState(active))
    const [isCurrentSong, setIsCurrentSong] = useState(false)
    const changeSong = (song:TrackT) => {
        if (song.id != currentSong.id) {
            setCurrentSong(song);
            startPlayerFunc()
            if (queueFunc) {
                queueFunc([trackWrap(song)]);
            }
        } else if (playerState.playing) {
            stopPlayerFunc()
        } else {
            startPlayerFunc()
        }
    }

    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        return !!likedSong
    }

    const updateLikedSongs = async (action:"liked" | "removed") => {
        setLikedSongsData( await fetchLikedSongs())
        if (action === "liked") trackAddedMessage(`Track ${track.title} added to Liked`);
        if (action === "removed") trackAddedMessage(`Track ${track.title} removed to Liked`);
    }

    useEffect(()=>{
        setIsCurrentSong(currentSong.id === track.id)
    },[currentSong])

    return (
            <div className={`track-wrapper animated-opacity-4ms ${isCurrentSong ? "track-current" : ""} ${!playerState.playing ? "active" : ""}`} onClick={()=>{changeSong(track)}}>
                <div className="track-cover-wrapper">
                    <div className={`track-playing-status ${isCurrentSong ? "show" : ""}`}>
                        {currentSong.id != track.id ? (
                            <PlayArrowRounded/>
                        ) : playerState.playing ? (
                            <EqualizerIcon/>
                            ) : (
                            <PauseRounded/>
                        )}
                    </div>
                    <Cover unWrapped placeholder={<ImagePlaceholder size="medium"/>} coverUri={track.coverUri} size="200x200"/>
                </div>
                <div className="track-info-wrapper">
                    <div className="track-info-title-wrapper">
                        {track.chart && <PositionInChart position={track.chart.position} progress={track.chart.progress}/>}
                        <div className="track-info-title">{track.title + `${track.version ? ` (${track.version})` : ""}`}</div>
                    </div>
                    <div onClick={(e)=>{e.stopPropagation()}} className="track-info-artists-wrapper">
                        <span className="track-info-artist-span">
                            {track.artists.map(artist => (
                                <ArtistName key={artist.id} size={"14px"} artist={artist}/>
                            ))}
                        </span>
                    </div>
                </div>
                <div onClick={(e)=>{e.stopPropagation()}} className="track-controls-wrapper">
                        {isLiked(track.id) ? (
                            <div className={`track-controls-button like`} onClick={()=>{dislikeSong(track).then((response) => updateLikedSongs("removed"))}}>
                                <Favorite/>
                            </div>
                        ) : (
                            <div className={`track-controls-button like`} onClick={()=>{likeSong(track).then((response) => updateLikedSongs("liked"))}}>
                                <FavoriteBorder/>
                            </div>
                        )}
                    <div className="track-controls-info-time">
                        {msToMinutesAndSeconds(track.durationMs)}
                    </div>
                    <div className="track-controls-button" onClick={()=>{setTrackInfoShowState(true);setTrackInfoState(track)}}>
                        <MoreVert/>
                    </div>
                </div>
        </div>
)
}

interface PositionInChartProps {
    position: number,
    progress?: "up" | "down" | "same"
}


const PositionInChart = ({position, progress}:PositionInChartProps) => {
    return (
        <div className="track-info-position-wrapper">
            <div className="track-info-position">{"# " + position}</div>
            <div className="track-info-progress">{progress === "up" ? <ArrowDropUp/> : progress === "down" ? <ArrowDropDown/> : <Remove/>}</div>
        </div>
    )
}


export default Track