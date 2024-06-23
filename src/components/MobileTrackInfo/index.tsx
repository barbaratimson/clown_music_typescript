import React, {useEffect, useState} from "react";
import {ArtistT, TrackId, TrackT} from "../../utils/types/types";
import {Link} from "react-router-dom";
import { Slide } from "@mui/material";
import {RootState, useAppSelector} from "../../store";
import {getImageLink} from "../../utils/utils";
import {
    Add, Album,
    Favorite,
    FavoriteBorder,
    PauseRounded,
    PeopleAlt,
    PlayArrowRounded,
    PlaylistAdd
} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";
import {dislikeSong, fetchLikedSongs, likeSong} from "../../utils/apiRequests";
import {showMessage} from "../../store/MessageSlice";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {useDispatch} from "react-redux";
import axios from "axios";
import {link} from "../../utils/constants";
import SongsList from "../SongsList";
import {trackArrayWrap} from "../../utils/trackWrap";

interface MobileTrackInfoProps {
    track:TrackT,
    active:boolean,
    setActiveState: Function
}

const MobileTrackInfo = ({track,active,setActiveState}:MobileTrackInfoProps) => {
    const dispatch= useDispatch()
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const trackAddedMessage = (message:string) => dispatch(showMessage({message:message}))
    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        return !!likedSong
    }
    const [isLoading, setIsLoading] = useState(true)
    const [similarTracks, setSimilarTracks] = useState()
    const fetchSimilarTracks = async (id:any) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/tracks/${id}/similar`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setSimilarTracks(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };

    const updateLikedSongs = async (action:"liked" | "removed") => {
        setLikedSongsData( await fetchLikedSongs())
        if (action === "liked") trackAddedMessage(`Track ${track.title} added to Liked`);
        if (action === "removed") trackAddedMessage(`Track ${track.title} removed to Liked`);
    }

    useEffect(() => {
        fetchSimilarTracks(track.id)
    }, [track]);

    useEffect(() => {
        if (active) {
            document.body.style.overflow = "hidden"
        }
        return () => {document.body.style.overflow = "unset"}
    }, [active]);

    return (
        <Slide direction={"up"} in={active}>
            <div className="track-info-mobile" onClick={()=>{setActiveState(false)}}>
                {active ? (
                   <>
                       <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
                           <div className="track-info-mobile-cover-wrapper">
                               <img src={getImageLink(track.coverUri, "200x200")} loading="lazy" alt=""/>
                           </div>
                           <div className="track-info-wrapper">
                               <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title">{track.title}</div>
                           </div>
                       </div>
                       <div className="track-info-mobile-controls-wrapper animated-opacity-4ms">
                           <div className="track-info-mobile-control-button">
                               <div className="track-info-mobile-control-icon">
                               {isLiked(track.id) ? (
                                   <div
                                       className={`player-track-controls-likeButton ${isLiked(track.id) ? "heart-pulse" : null}`}
                                       onClick={() => {
                                           dislikeSong(track).then((response) => updateLikedSongs("removed"))
                                       }}>
                                       <Favorite/>
                                   </div>
                               ) : (
                                   <div className={`player-track-controls-likeButton`} onClick={() => {
                                       likeSong(track).then((response) => updateLikedSongs("liked"))
                                   }}>
                                       <FavoriteBorder/>
                                   </div>
                               )}
                               </div>
                               <div className="track-info-mobile-control-label">
                                   Like
                               </div>
                           </div>

                           <div className="track-info-mobile-control-button">
                               <div className="track-info-mobile-control-icon">
                                   <PlaylistAdd/>
                               </div>
                               <div className="track-info-mobile-control-label">
                                    Play next
                               </div>
                           </div>
                           <div className="track-info-mobile-control-button">
                               <div className="track-info-mobile-control-icon">
                                   <PeopleAlt/>
                               </div>
                               <div className="track-info-mobile-control-label">
                                   Artists
                               </div>
                           </div>
                           <div className="track-info-mobile-control-button">
                               <div className="track-info-mobile-control-icon">
                                   <Add/>
                               </div>
                               <div className="track-info-mobile-control-label">
                                   Add to playlist
                               </div>
                           </div>
                           <div className="track-info-mobile-control-button">
                               <div className="track-info-mobile-control-icon">
                                   <Album/>
                               </div>
                               <div className="track-info-mobile-control-label">
                                   Album
                               </div>
                           </div>

                       </div>
                       <div className="track-info-mobile-similar-tracks">
                           {similarTracks ? (
                             <SongsList playlist={trackArrayWrap(similarTracks?.similarTracks)} tracks={trackArrayWrap(similarTracks?.similarTracks)}/>
                           ) : null}
                       </div>
                       {/*<div className="track-info-wrapper">*/}
                       {/*            {track.artists.map((artist) => (*/}
                       {/*                <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}>*/}
                       {/*                    <div className="album-artist-info">*/}
                       {/*                        <div className="album-artist-avatar-wrapper">*/}
                       {/*                            <img*/}
                       {/*                                src={getImageLink(artist.cover.uri, "50x50") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}*/}
                       {/*                                alt="" loading="lazy"/>*/}
                       {/*                        </div>*/}
                       {/*                        <div className="album-artist-info-name">{artist.name}</div>*/}
                       {/*                    </div>*/}
                       {/*                </Link>*/}
                       {/*            ))}*/}
                       {/*    </div>*/}
                   </>
                    )
                    : null}
            </div>
        </Slide>
    )
}

export default MobileTrackInfo