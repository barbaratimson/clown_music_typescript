import React, {ReactElement, useEffect, useState} from "react";
import {ArtistT, TrackId, TrackT, TrackType} from "../../utils/types/types";
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
import { setActiveState } from "../../store/trackInfoSlice";
import CurrentSongSlice from "../../store/CurrentSongSlice";
import { addTrackToQueuePosition } from "../../store/playingQueueSlice";

interface PopUpModalProps {
    children:ReactElement,
    active: boolean,
    setActive: any,
    unmount?:boolean
}

const PopUpModal = ({children,active,setActive,unmount}:PopUpModalProps) => {
    const location = useLocation()

    useEffect(()=>{
        setActive(false)
    },[location])

    return (
        <>
            <Slide direction={"up"} in={active} unmountOnExit={unmount}>
                    <div className="track-info-mobile" onClick={()=>{setActive(false);console.log("dsdsd")}}>
                        {children}
                    </div>
            </Slide>
        </>
    )
}

export default PopUpModal
