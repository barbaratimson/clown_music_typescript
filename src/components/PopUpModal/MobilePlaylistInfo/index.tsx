import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import {RootState, useAppSelector} from "../../../store";
import {Add, Close, Delete, ExpandMore, FilterAlt, KeyboardArrowDown} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import Cover, {ImagePlaceholder} from "../../Cover";
import {setPlaylistInfoActiveState} from "../../../store/playlistInfoSlice";
import PopUpModal from "../index";
import axios from "axios";
import {link} from "../../../utils/constants";
import "./style.scss"

interface GenreCountT {
    genre: string,
    amount: number,
    percentage: number
}

const MobilePlaylistInfo = () => {
    const dispatch = useDispatch()
    const [params, setParams] = useSearchParams("")
    const playlistInfoState = useAppSelector((state: RootState) => state.playlistInfo)
    const setPlaylistInfoShow = (active: boolean) => dispatch(setPlaylistInfoActiveState(active))
    const [filterMenuActive, setFilterMenuActive] = useState(false)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const [isLoading, setIsLoading] = useState(true)
    const [genres, setGenres] = useState<GenreCountT[]>()
    const [genre, setGenre] = useState<GenreCountT>()
    const [filterQuery, setFilterQuery] = useSearchParams("")
    const navigate = useNavigate()
    const [genresToFilter, setGenresToFilter] = useState<string[]>([])

    const removePlaylist = async (playlistId:number) => {
        try {
            const response = await axios.get(
                `${link}/ya/playlist/${playlistId}/remove`, {headers: { "Authorization": localStorage.getItem("Authorization") } });
            console.log(response.data)
            if (response.data === "ok") {
                navigate(-1)
            }
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    }

    const genresHandler = () => {

    }

    useEffect(() => {
        const genres = playlistInfoState.playlist.tracks.map((track) => {
            if (track.track.albums[0]?.genre !== undefined) {
                return track.track.albums[0]?.genre
            } else {
                return "Unknown"
            }
        })
        const uniqueGenres = Array.from(new Set(genres))
        const countAmount = uniqueGenres.map((genre) => {
            const amountOfGenre = genres.filter(elem => elem == genre)
            const genrePecentage = amountOfGenre.length * 100 /genres.length
            return { genre: genre, amount: amountOfGenre.length , percentage: genrePecentage}
        })
        setGenres(countAmount.sort((a, b) => b.amount - a.amount))
    }, [playlistInfoState.playlist]);

    useEffect(() => {
        const filter = filterQuery.getAll("genres")
        if (filter.length !== 0) {
            setGenresToFilter(filter)
        } else {
            setGenresToFilter([])
        }
    }, [filterQuery]);



    useEffect(() => {
        setFilterQuery({genres: genresToFilter})
    }, [genresToFilter]);


    return (
        <>
            <PopUpModal active={playlistInfoState.active} setActive={setPlaylistInfoShow}>
                <>
                    {playlistInfoState.playlist ? (
                            <>
                                <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
                                    <Cover placeholder={<ImagePlaceholder size="medium"/>} coverUri={playlistInfoState.playlist.cover?.uri} size="75x75" imageSize="200x200"/>
                                    <div className="track-info-wrapper">
                                        <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{playlistInfoState.playlist.title}</div>
                                        <div style={{ marginTop: "5px" }} className="track-info-artist">{playlistInfoState.playlist.tracks.length + " tracks"}</div>
                                    </div>
                                    <div className="track-info-back-button">
                                        <KeyboardArrowDown className="track-info-back-icon"/>
                                    </div>
                                </div>
                                <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => { e.stopPropagation() }}>
                                    <div className="track-info-mobile-control-button">
                                        <div className="track-info-mobile-control-icon">
                                            <Add />
                                        </div>
                                        <div className="track-info-mobile-control-label">
                                            Add playlist
                                        </div>
                                    </div>
                                    <div className="track-info-mobile-control-button" onClick={() => {setFilterMenuActive(!filterMenuActive);setPlaylistInfoShow(false)}}>
                                        <>
                                            <div className="track-info-mobile-control-icon">
                                                <FilterAlt />
                                            </div>
                                            <div className="track-info-mobile-control-label">
                                                Filter
                                            </div>
                                            {filterQuery.getAll("genres").length !== 0 ? (
                                                <div className="track-info-mobile-control-label additional" onClick={(e)=>{e.stopPropagation();filterQuery.delete("genres");setFilterQuery(filterQuery);setPlaylistInfoShow(false)}}>
                                                    <Close />
                                                </div>
                                            ) : null}
                                        </>
                                    </div>
                                    <div className="track-info-mobile-control-button" onClick={() => {
                                        // removePlaylist(playlistInfoState.playlist.kind)
                                        console.log("Delete playlist")
                                    }}>
                                        <div className="track-info-mobile-control-icon">
                                            <Delete/>
                                        </div>
                                        <div className="track-info-mobile-control-label">
                                            Remove playlist
                                        </div>
                                    </div>
                                </div>

                            </>
                        )
                        : null

                    }
                </>
            </PopUpModal>

            <PopUpModal active={filterMenuActive} setActive={setFilterMenuActive}>
                <>
                    <div className="playlist-filter__title"><ExpandMore /></div>
                    <div className="playlist-filter__wrapper" onClick={(e)=>{e.stopPropagation()}}>
                        {genres ? genres.map(genreRender => (
                            <div key={genreRender.genre} className={`playlist-filter__button  ${filterQuery.getAll("genres").includes(genreRender.genre) ? "active" : ""}`}
                                 onClick={() => {
                                        !filterQuery.getAll("genres")?.includes(genreRender.genre) && genreRender.genre ?
                                         // setFilterQuery({ genre: [genreRender.genre })
                                         setGenresToFilter(genresToFilter?.concat(genreRender.genre))
                                         :
                                         setGenresToFilter(genresToFilter.filter(elem => elem !== genreRender.genre))
                                 }}>
                                <div className="playlist-filter__button_text">{genreRender.genre ? genreRender.genre.charAt(0).toUpperCase() + genreRender.genre.slice(1) : null}</div>
                                <div className="playlist-filter__button_amount" style={{ width: genreRender.percentage * 100 / genres[0].percentage + "%" }}>
                                    <div className="playlist-filter__button_amount_number">{genreRender.amount}</div>
                                </div>
                            </div>
                        )) : null}
                    </div>
                </>
            </PopUpModal>
        </>
    )
}

export default MobilePlaylistInfo
