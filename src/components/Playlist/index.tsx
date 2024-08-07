import React, {useEffect, useRef, useState} from "react";
import {PlaylistT, TrackType} from "../../utils/types/types";
import {getImageLink, isElementInViewport} from "../../utils/utils";
import SongsList from "../SongsList";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {setQueue} from "../../store/playingQueueSlice";
import {useSearchParams} from "react-router-dom";
import {hideHeader, showHeader} from "../../store/mobile/mobileHeaderSlice";
import { signImage } from "../../assets/sign";
import PopUpModal from "../PopUpModal";
import {ExpandMore, FilterAlt} from "@mui/icons-material";

interface PlaylistProps {
    playlist: PlaylistT
}

const link = process.env.REACT_APP_YMAPI_LINK

interface GenreCountT {
    genre: string,
    amount: number
}
const Playlist = ({playlist}: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const setHeaderActive = (state:any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const playlistInfo = useRef(null)
    const [genres, setGenres] = useState<GenreCountT[]>()
    const [genre, setGenre] = useState<GenreCountT>()
    const [tracksFiltered, setTracksFiltered] = useState<Array<TrackType>>()
    const [filterQuery,setFilterQuery] = useSearchParams("")
    const [filterMenuActive, setFilterMenuActive] = useState(false)

    useEffect(() => {
        const genres = playlist.tracks.map((track) => {
            if (track.track.albums[0]?.genre !== undefined) {
                return track.track.albums[0]?.genre
            } else {
                return "Unknown"
            }
        })
        const uniqueGenres = Array.from(new Set(genres))
        const countAmount = uniqueGenres.map((genre) => {
            const amountOfGenre = genres.filter(elem => elem == genre)
            return {genre:genre,amount:amountOfGenre.length}
        })
        setGenres(countAmount.sort((a,b) => b.amount-a.amount))
    }, []);

    useEffect(() => {
        const filter = filterQuery.get("genre")
        if (filter === "Unknown") {
            setTracksFiltered(playlist.tracks.filter(track => track.track.albums[0]?.genre === undefined))
        } else if (filter){
            setTracksFiltered(playlist.tracks.filter(track => track.track.albums[0]?.genre === filter))
        } else {
            setTracksFiltered(playlist.tracks)
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

    useEffect(() => {
        if (filterMenuActive) {
            document.body.style.overflow = "hidden"
        }
        return () => {document.body.style.overflow = "unset"}
    }, [filterMenuActive]);

    return (
        <>
            <div className="playlist-wrapper mobile-folded animated-opacity">
                <div ref={playlistInfo} className="playlist">
                    <div className="playlist-cover-wrapper">
                        <img src={getImageLink(playlist.cover.uri, "600x600") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                    </div>
                    <div className="playlist-info-wrapper">
                    <div className="playlist-info-section">
                    {/* <div className="playlist-info-title main">
                            Плейлист
                        </div> */}
                        <div className="playlist-info-title">
                            {playlist.title}
                        </div>
                        <div className="playlist-info-desc">
                            {playlist.description}
                        </div>
                        {playlist.kind=== 3 && false ? (
                            <div className="playlist-sign-wrapper">
                                <img className="playlist-sign" src={signImage} alt=""/>
                            </div>
                        ) : null}
                    </div>
                    <div className="playlist-info-controls">
                        <div className="playlist-filter-info">
                            <FilterAlt onClick={()=>{setFilterMenuActive(!filterMenuActive)}}/>
                        </div>
                    </div>
                    </div>
                </div>
                <SongsList playlist={tracksFiltered ? {...playlist, tracks:tracksFiltered, title: `${playlist.title} ${filterQuery.get("genre") !== null ? `(${filterQuery.get("genre")})` : "" }`} : playlist} tracks={tracksFiltered ?? playlist.tracks}/>
            </div>

            <PopUpModal active={filterMenuActive} setActive={setFilterMenuActive}>
                <>
                         <div className="playlist-filter-title"><ExpandMore/></div>
                    <div className="playlist-filter-wrapper">
                        {genres ? genres.map(genreRender => (
                            <div className={`playlist-filter-button  ${filterQuery.get("genre") === genreRender.genre ? "playlist-filter-button-active" : ""}`} onClick={()=>{filterQuery.get("genre") !== genreRender.genre && genreRender.genre ? setFilterQuery({genre:genreRender.genre}) : setFilterQuery(undefined)}}>
                                <div className="playlist-filter-button-text" key={genreRender.genre}>{genreRender.genre ? genreRender.genre.charAt(0).toUpperCase() + genreRender.genre.slice(1) : null}</div>
                                <div className="playlist-filter-button-amount"  style={{width:genreRender.amount + "%"}}>
                                    <div className="playlist-filter-button-amount-number">{genreRender.amount}</div>
                                </div>
                            </div>
                        )) : null}
                    </div>
                </>
            </PopUpModal>
        </>
    )
}

export default Playlist