import React, {useEffect, useState} from "react";
import {ChartTrackT, TrackDefaultT, TrackT, TrackType} from "../../utils/types/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong, updateSongLink} from "../../store/CurrentSongSlice";
import axios from "axios";
import {playerSeekTo, playerStart, playerStop, setIsLoading, setSrc} from "../../store/PlayerSlice";
import {getImageLink} from "../../utils/utils";
import {MusicNote, PauseRounded, PlayArrowOutlined, PlayArrowRounded} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import EqualizerIcon from "../../assets/EqualizerIcon";
import {Link} from "react-router-dom";
import ArtistName from "../ArtistName";


interface TrackProps {
    track : TrackT
}

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({track}:TrackProps) => {
    const dispatch = useAppDispatch()
    const [changeSongInactive, setChangeSongInactive] = useState(false)
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const setCurrentSong = (track:TrackT) =>dispatch(changeCurrentSong(track))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())

    const playerState = useAppSelector((state:RootState)=>state.player)

    const changeSong = (song:TrackT) => {
        if (changeSongInactive) return
        if (song.id != currentSong.id) {
            setCurrentSong(song)
        } else if (playerState.playing) {
            stopPlayerFunc()
        } else {
            startPlayerFunc()
        }
    }

    return (
            <div className={`track-wrapper ${currentSong.id == track.id ? "track-current" : ""}`}   onClick={()=>{changeSong(track)}}>
                <div className="track-cover-wrapper">
                    <div className={`track-playing-status ${currentSong.id == track.id ? "show" : ""}`}>
                        {currentSong.id != track.id ? (
                            <PlayArrowRounded/>
                        ) : playerState.playing ? (
                            <EqualizerIcon/>
                            ) : (
                            <PauseRounded/>
                        )}
                    </div>
                    <img src={getImageLink(track.coverUri, "200x200")} loading="lazy" alt=""/>
                </div>
                <div className="track-info-wrapper">
                    <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title">{track.title}</div>
                    <div onClick={(e)=>{e.stopPropagation()}} className="track-info-artists-wrapper">
                        {track.artists.map(artist => (
                            <ArtistName size={"12px"} artist={artist}/>
                        ))}
                    </div>
                </div>
                <div onClick={(e)=>{e.stopPropagation()}} className="track-controls-wrapper"></div>
            </div>
    )
}


export default Track