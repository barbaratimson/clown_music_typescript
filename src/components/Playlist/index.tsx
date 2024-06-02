import React, {useEffect, useRef, useState} from "react";
import {PlaylistT, TrackType} from "../../utils/types/types";
import {getImageLink, isElementInViewport} from "../../utils/utils";
import SongsList from "../SongsList";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {setQueue} from "../../store/playingQueueSlice";
import {useSearchParams} from "react-router-dom";
import {hideHeader, showHeader} from "../../store/mobile/mobileHeaderSlice";
import { signImage } from "../../assets/sign";

interface PlaylistProps {
    playlist: PlaylistT
}

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({playlist}: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const setHeaderActive = (state:any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const playlistInfo = useRef(null)
    const [genres, setGenres] = useState<Array<string | undefined>>()
    const [genre, setGenre] = useState<string>()
    const [tracksFiltred, setTracksFiltred] = useState<Array<TrackType>>()
    const [filterQuery,setFilterQuery] = useSearchParams("")

    useEffect(() => {
        const genres = playlist.tracks.map((track) => {
            if (track.track.albums[0]?.genre !== undefined) {
                return track.track.albums[0]?.genre
            } else {
                return "Unknown"
            }
        })
        setGenres(Array.from(new Set(genres)))
    }, []);

    useEffect(() => {
        const filter = filterQuery.get("genre")
        if (filter === "Unknown") {
            setTracksFiltred(playlist.tracks.filter(track => track.track.albums[0]?.genre === undefined))
        } else if (filter){
            setTracksFiltred(playlist.tracks.filter(track => track.track.albums[0]?.genre === filter))
        } else {
            setTracksFiltred(playlist.tracks)
        }
    }, [filterQuery.get("genre")]);

    useEffect(() => {
        const a = () => {
            if (playlistInfo.current && !isElementInViewport(playlistInfo.current)) {
                 setHeaderActive({title:playlist.title})
            } else {
                setHeaderOff()
            }
        }
        document.addEventListener("scroll",a)
        return ()=>{document.removeEventListener("scroll",a);setHeaderOff()}
    }, []);

    return (
        <div className="playlist-wrapper animated-opacity">
            <div ref={playlistInfo} className="playlist">
                <div className="playlist-cover-wrapper">
                    <img src={getImageLink(playlist.cover.uri, "600x600") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                </div>
                <div className="playlist-info-wrapper">
                    <div className="playlist-info-title">
                        {playlist.title}
                    </div>
                    <div className="playlist-info-desc">
                        {playlist.description}
                    </div>
                </div>
                {/*TODO: HIDDEN!!!!!*/}
                {playlist.kind=== 3 && false ? (
                    <div className="playlist-sign-wrapper">
                        <img className="playlist-sign" src={signImage} alt=""/>
                    </div>
                ) : null}
                <div className="playlist-filter-info"></div>
            </div>
            <div className="playlist-filter-wrapper">
                    {genres ? genres.map(genreRender => (
                        <div className={`playlist-filter-button ${filterQuery.get("genre") === genreRender ? "playlist-filter-button-active" : null}`} onClick={()=>{filterQuery.get("genre") !== genreRender && genreRender ? setFilterQuery({genre:genreRender}) : setFilterQuery(undefined)}}>{genreRender ? genreRender.charAt(0).toUpperCase() + genreRender.slice(1) : null}</div>
                    )) : null}
            </div>
            <SongsList playlist={playlist} tracks={tracksFiltred ?? playlist.tracks}/>
        </div>
    )
}

export default Playlist