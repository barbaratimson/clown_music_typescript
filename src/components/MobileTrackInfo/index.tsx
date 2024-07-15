import React, {useEffect, useState} from "react";
import {ArtistT, TrackId, TrackT} from "../../utils/types/types";
import {Link} from "react-router-dom";
import { ClickAwayListener, Slide } from "@mui/material";
import {RootState, useAppSelector} from "../../store";
import {getImageLink} from "../../utils/utils";
import {
    Add, Album,
    Favorite,
    FavoriteBorder,
    KeyboardArrowDown,
    KeyboardArrowLeft,
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
import Loader from "../Loader";
import { useLocation } from 'react-router-dom'

interface MobileTrackInfoProps {
    track:TrackT,
    active:boolean,
    setActiveState: Function
}

interface SimilarTracksT {
    track:TrackT
    similarTracks:Array<TrackT>
}

const MobileTrackInfo = ({track,active,setActiveState}:MobileTrackInfoProps) => {
    const dispatch= useDispatch()
    const location = useLocation()
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const trackAddedMessage = (message:string) => dispatch(showMessage({message:message}))
    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        return !!likedSong
    }
    const [isLoading, setIsLoading] = useState(true)
    const [similarTracks, setSimilarTracks] = useState<SimilarTracksT>()
    const [artistsOpen,setArtistsOpen] = useState(false)
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

    const closeAll = () => {
        setArtistsOpen(false);
        setActiveState(false);
    }

    const updateLikedSongs = async (action:"liked" | "removed") => {
        setLikedSongsData( await fetchLikedSongs())
        if (action === "liked") trackAddedMessage(`Track ${track.title} added to Liked`);
        if (action === "removed") trackAddedMessage(`Track ${track.title} removed to Liked`);
    }

    useEffect(() => {
        fetchSimilarTracks(track.id)
    }, [track]);

    useEffect(()=>{
       closeAll()
    },[location])

    return (
        <>

        <Slide direction={"up"} in={active}>
            <div className="track-info-mobile" onClick={()=>{!artistsOpen ? setActiveState(false) : setArtistsOpen(false)}}>
                {track.id ? (
                   <>
                       <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
                           <div className="track-info-mobile-cover-wrapper">
                               <img src={getImageLink(track.coverUri, "200x200")} loading="lazy" alt=""/>
                           </div>
                           <div className="track-info-wrapper">
                               <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title mobile">{track.title}</div>
                           </div>
                           <div className="track-info-back-button">
                             <KeyboardArrowDown className="track-info-back-icon" style={{rotate: artistsOpen ? "90deg" : "0deg"}}/>
                           </div>
                       </div>
                       <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e)=>{e.stopPropagation()}}>
                           <div className="track-info-mobile-control-button" onClick={(e)=>(isLiked(track.id) ? dislikeSong(track).then((response) => updateLikedSongs("removed")) :  likeSong(track).then((response) => updateLikedSongs("liked")))}>
                                <div className="track-info-mobile-control-icon">
                                {isLiked(track.id) ? (
                                    <div
                                    className={`player-track-controls-likeButton ${isLiked(track.id) ? "heart-pulse" : null}`}>
                                        <Favorite/>
                                    </div>
                                ) : (
                                    <div className={`player-track-controls-likeButton`}>
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
                            <div className="track-info-mobile-control-button" onClick={()=>{setArtistsOpen(true)}}>
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
                                <Link className="track-info-mobile-control-button" style={{textDecoration:"none"}} to={`/artist/${track.albums[0].artists[0].id}/album/${track.albums[0].id}`}>
                                    <div className="track-info-mobile-control-icon">
                                    <Album/>
                                </div>
                                <div className="track-info-mobile-control-label">
                                    Album
                                </div>
                                </Link>


                       </div>
                       <div className="track-info-mobile-similar-tracks" onClick={(e)=>{e.stopPropagation()}}>
                           {similarTracks && !isLoading ? (
                             <SongsList style={{flexDirection:"row"}} playlist={{kind:-1,cover:{uri:similarTracks.track.coverUri},uid:0,ogImage:similarTracks.track.coverUri,available:true,owner:{uid:similarTracks.track.artists[0].id,name:similarTracks.track.artists[0].name,verified:true},title:`${similarTracks.track.title}: Similar`,description:"",tracks:trackArrayWrap(similarTracks.similarTracks)}} tracks={trackArrayWrap(similarTracks?.similarTracks)}/>
                           ) :
                           <div style={{width:"100%",height:"45px"}}>
                                <Loader size={30}/>
                           </div>
                            }
                           
                       </div>
                   </>
                    )
                    : null
                    
                }
            </div>
        </Slide>
    
        <Slide direction="up" in={active && artistsOpen}>
          <div className="track-info-mobile" onClick={()=>{setArtistsOpen(false)}}>
            <div className="track-info-artists-title-wrapper">
            <div className="track-info-artists-title">Artists</div>
            </div>
              {track.artists ? (track.artists.map((artist) => (
                  <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}>
                                <div className="track-info-artist-info">
                                    <div className="track-info-artist-avatar-wrapper">
                                        <img
                                            src={getImageLink(artist.cover?.uri, "50x50") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}
                                            alt="" loading="lazy"/>
                                    </div>
                                    <div className="track-info-artist-info-name">{artist.name}</div>
                                </div>
                                </Link>
                            ))): null}
                            </div>
        </Slide>
        </>

    )
}

export default MobileTrackInfo
