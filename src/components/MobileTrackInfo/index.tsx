import React from "react";
import {ArtistT, TrackT} from "../../utils/types/types";
import {Link} from "react-router-dom";
import { Slide } from "@mui/material";
import {RootState, useAppSelector} from "../../store";
import {getImageLink} from "../../utils/utils";
import {PauseRounded, PlayArrowRounded} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";

interface MobileTrackInfoProps {
    track:TrackT,
    active:boolean,
    setActiveState: Function
}

const MobileTrackInfo = ({track,active,setActiveState}:MobileTrackInfoProps) => {
    return (
        <Slide direction={"up"} in={active}>
            <div className="track-info-mobile" onClick={()=>{setActiveState(false)}}>
                {active ? (
                   <>
                       <div className="track-info-wrapper">
                           <img src={getImageLink(track.coverUri, "200x200")} loading="lazy" alt=""/>
                       </div>
                       <div className="track-info-wrapper">
                           <div onClick={(e)=>{e.stopPropagation()}} className="track-info-title">{track.title}</div>
                                   {track.artists.map((artist) => (
                                       <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}>
                                           <div className="album-artist-info">
                                               <div className="album-artist-avatar-wrapper">
                                                   <img
                                                       src={getImageLink(artist.cover.uri, "50x50") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}
                                                       alt="" loading="lazy"/>
                                               </div>
                                               <div className="album-artist-info-name">{artist.name}</div>
                                           </div>
                                       </Link>
                                   ))}
                           </div>
                   </>
                    )
                    : null}
            </div>
        </Slide>
    )
}

export default MobileTrackInfo