import React, {useEffect, useState} from "react";
import {TrackId, TrackT} from "../../utils/types/types";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop} from "../../store/PlayerSlice";
import {getImageLink, msToMinutesAndSeconds, secToMinutesAndSeconds} from "../../utils/utils";
import {Favorite, FavoriteBorder, MoreVert, PauseRounded, PlayArrowRounded} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";
import {dislikeSong, fetchLikedSongs, likeSong} from "../../utils/apiRequests";
import {userId} from "../../utils/constants";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {showMessage} from "../../store/MessageSlice";


interface TrackProps {
    track : TrackT
}

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({track}:TrackProps) => {
    const dispatch = useAppDispatch()
    const [changeSongInactive, setChangeSongInactive] = useState(false)
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const trackAddedMessage = (message:string) => dispatch(showMessage({message:message}))
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
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
        console.log(track)
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
                        <span className="track-info-artist-span">
                            {track.artists.map(artist => (
                                <ArtistName size={"12px"} artist={artist}/>
                            ))}
                        </span>
                    </div>
                </div>
                <div onClick={(e)=>{e.stopPropagation()}} className="track-controls-wrapper">
                        {isLiked(track.id) ? (
                            <div className={`track-controls-button`} onClick={()=>{dislikeSong(track).then((response) => updateLikedSongs("removed"))}}>
                                <Favorite/>
                            </div>
                        ) : (
                            <div className={`track-controls-button`} onClick={()=>{likeSong(track).then((response) => updateLikedSongs("liked"))}}>
                                <FavoriteBorder/>
                            </div>
                        )}
                    <div className="track-controls-info-time">
                        {msToMinutesAndSeconds(track.durationMs)}
                    </div>
                    <div className="track-controls-button">
                        <MoreVert/>
                    </div>
                </div>
        </div>
)
}


export default Track