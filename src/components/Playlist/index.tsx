import React, {useEffect, useRef, useState} from "react";
import {PlaylistT, TrackT, TrackType} from "../../utils/types/types";
import {isElementInViewport} from "../../utils/utils";
import SongsList from "../SongsList";
import {useAppDispatch} from "../../store";
import {useNavigate, useSearchParams} from "react-router-dom";
import {hideHeader, showHeader} from "../../store/mobile/mobileHeaderSlice";
import PopUpModal from "../PopUpModal";
import {Delete, ExpandMore, FilterAlt, MoreHoriz} from "@mui/icons-material";
import PageHeader from "../PageHeader";
import axios from "axios";
import {setPlaylistInfo, setPlaylistInfoActiveState} from "../../store/playlistInfoSlice";
import {setTrackInfo} from "../../store/trackInfoSlice";
import { Skeleton } from "@mui/material";
import "./style.scss"

interface PlaylistProps {
    playlist: PlaylistT
}

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({ playlist }: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const setHeaderActive = (state: any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const playlistInfo = useRef(null)
    const [tracksFiltered, setTracksFiltered] = useState<Array<TrackType>>()
    const [filterQuery, setFilterQuery] = useSearchParams("")
    const [filterMenuActive, setFilterMenuActive] = useState(false)
    const setPlaylistInfoShow = (active: boolean) => dispatch(setPlaylistInfoActiveState(active))
    const setPlaylistInfoState = (playlist:PlaylistT) => dispatch(setPlaylistInfo(playlist))

    useEffect(() => {
        const filter = filterQuery.getAll("genres")
        if (filter.includes("Unknown")) {
            setTracksFiltered(playlist.tracks.filter(track => track.track.albums[0]?.genre === undefined))
        } else if (filter.length !== 0) {
            setTracksFiltered(playlist.tracks.filter(track => filter.includes(track.track.albums[0]?.genre)))
        } else {
            setTracksFiltered(playlist.tracks)
        }
    }, [filterQuery]);

    useEffect(() => {
        const a = () => {
            if (playlistInfo.current && !isElementInViewport(playlistInfo.current)) {
                setHeaderActive({ title: playlist.title })
            } else {
                setHeaderOff()
            }
        }
        document.addEventListener("scroll", a)
        return () => { document.removeEventListener("scroll", a); setHeaderOff() }
    }, []);

    useEffect(() => {
        if (filterMenuActive) {
            document.body.style.overflow = "hidden"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [filterMenuActive]);

    return (
        <>
            <div className="playlist-wrapper mobile-folded animated-opacity">
                <PageHeader ref={playlistInfo} titleText={playlist.title} descText={playlist.description} coverUri={playlist.coverWithoutText ? playlist.coverWithoutText.uri : playlist.ogImage} controls={
                    <>
                        <span className="playlist__filters">
                            {filterQuery.getAll("genres").map((genre) => (
                                <a key={genre} className="playlist__filters_filter-title">{genre.charAt(0).toUpperCase() + genre.slice(1) }</a>
                            ))}
                        </span>
                        <MoreHoriz onClick={() => { setPlaylistInfoShow(true);setPlaylistInfoState(playlist)}} />
                    </>
                } />
                    <SongsList playlist={tracksFiltered ? { ...playlist, tracks: tracksFiltered } : playlist} tracks={tracksFiltered ?? playlist.tracks} />
            </div>
        </>
    )
}

export default Playlist