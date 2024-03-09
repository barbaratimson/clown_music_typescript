import React, {useEffect} from "react";
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


interface TrackProps {
    track : TrackType
}

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({track}:TrackProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setCurrentSong = (track:TrackType) => dispatch(changeCurrentSong(track))

    const playerState = useAppSelector((state:RootState)=>state.player)

    const changeSong = async (song:TrackType) => {
        if (song.id != currentSong.id) {
            setCurrentSong(song)
        } else if (playerState.playing) {
            stopPlayerFunc()
        } else {
            startPlayerFunc()
        }
    }

    return (
        <div className="track-chart-wrapper">
            {track.track.chart ? (
                <div className="track-chart-position-wrapper">
                    <div className="track-chart-position">
                        {track.track.chart.position}
                    </div>
                </div>
            ) : null}
            <div className={`track-wrapper ${currentSong.track.id == track.track.id ? "track-current" : ""}`}   onClick={()=>{changeSong(track)}}>
                <div className="track-cover-wrapper">
                    <div className={`track-playing-status ${currentSong.track.id == track.track.id ? "show" : ""}`}>
                        {currentSong.id != track.id ? (
                            <PlayArrowRounded/>
                        ) : playerState.playing ? (
                            <EqualizerIcon/>
                            ) : (
                            <PauseRounded/>
                        )}
                    </div>
                    <img src={getImageLink(track.track.coverUri, "200x200")} loading="lazy" alt=""/>
                </div>
                <div className="track-info-wrapper">
                    <div className="track-info-title">{track.track.title}</div>
                    <div className="track-info-artists-wrapper">
                        {track.track.artists.map(artist => (
                            <div className="track-info-artist">{artist.name}</div>
                        ))}
                    </div>
                </div>
                <div className="track-controls-wrapper"></div>
            </div>
        </div>
    )
}


export default Track