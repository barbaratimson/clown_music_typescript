import React, {useEffect, useState} from "react";
import {TrackId, TrackT} from "../../utils/types/types";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop} from "../Player/playerSlice";
import {msToMinutesAndSeconds} from "../../utils/utils";
import {MoreVert, PauseRounded, PlayArrowRounded} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {showMessage} from "../../store/MessageSlice";
import {trackWrap} from "../../utils/trackWrap";
import {setTrackInfo, setTrackInfoActiveState} from "../../store/trackInfoSlice";
import Cover, {ImagePlaceholder} from "../Cover";
import LikeButton from "../LikeButton";
import './style.scss'


interface TrackProps {
    track: TrackT,
    queueFunc?: Function
}

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({track, queueFunc}: TrackProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const playerState = useAppSelector((state: RootState) => state.player)
    const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setTrackInfoState = (track: TrackT) => dispatch(setTrackInfo(track))
    const setTrackInfoShowState = (active: boolean) => dispatch(setTrackInfoActiveState(active))
    const [isCurrentSong, setIsCurrentSong] = useState(false)
    const changeSong = (song: TrackT) => {
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


    useEffect(() => {
        setIsCurrentSong(currentSong.id === track.id)
    }, [currentSong])

    return (
        <div
            className={`track-wrapper animated-opacity-4ms ${isCurrentSong ? "track-current" : ""} ${!playerState.playing ? "active" : ""}`}
            onClick={() => {
                changeSong(track)
            }}>
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
                <Cover unWrapped placeholder={<ImagePlaceholder size="medium"/>} coverUri={track.coverUri}
                       size="200x200"/>
            </div>
            <div className="track-info-wrapper">
                <div className="track-info-title-wrapper">
                    {track.chart && <PositionInChart position={track.chart.position}/>}
                    <div
                        className="track-info-title">{track.title + `${track.version ? ` (${track.version})` : ""}`}</div>
                </div>
                <div onClick={(e) => {
                    e.stopPropagation()
                }} className="track-info-artists-wrapper">
                        <span className="track-info-artist-span">
                            {track.artists.map(artist => (
                                <ArtistName key={artist.id} artist={artist}/>
                            ))}
                        </span>
                </div>
            </div>
            <div onClick={(e) => {
                e.stopPropagation()
            }} className="track-controls-wrapper">
                <LikeButton className="mobile-hidden" track={track}/>
                <div className="track-controls-info-time">
                    {msToMinutesAndSeconds(track.durationMs)}
                </div>
                <div className="track-controls-button" onClick={() => {
                    setTrackInfoShowState(true);
                    setTrackInfoState(track)
                }}>
                    <MoreVert/>
                </div>
            </div>
        </div>
    )
}

interface PositionInChartProps {
    position: number,
    text?: string
}


export const PositionInChart = ({position, text}: PositionInChartProps) => {
    return (
        <div className="track-info-position">{text ?? "#" + position}</div>
    )
}


export default Track