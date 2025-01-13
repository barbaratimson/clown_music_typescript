import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import {RootState, useAppSelector} from "../../store";
import {Delete, FilterAlt, FilterAltOff} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import axios from "axios";
import {link} from "../../utils/constants";
import "./PlaylistInfo.scss"
import {PlaylistT} from "../../utils/types/types";
import {Popper} from "@mui/material";
import ContextMenu from "../UI/ContextMenu/ContextMenu";
import Button from "../UI/Button/Button";

interface PlaylistInfoProps {
    playlist: PlaylistT
}

interface GenreCountT {
    genre: string,
    amount: number,
    percentage: number
}


const PlaylistInfo = ({playlist}: PlaylistInfoProps) => {
    const dispatch = useDispatch()
    const [params, setParams] = useSearchParams("")
    const [filterMenuActive, setFilterMenuActive] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [genres, setGenres] = useState<GenreCountT[]>()
    const [filterQuery, setFilterQuery] = useSearchParams("")
    const navigate = useNavigate()
    const [genresToFilter, setGenresToFilter] = useState<string[]>([])
    const currentUser = useAppSelector((state: RootState) => state.user)
    const [userPlaylists, setUserPlaylists] = useState<PlaylistT[]>()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLDivElement>(null);

    const addPlaylist = async (playlistId: number) => {
        try {
            const response = await axios.get(
                `${link}/ya/playlist/${playlistId}/add`, {headers: {"Authorization": localStorage.getItem("Authorization")}});
            console.log(response.data)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    }

    const removePlaylist = async (playlistId: number) => {
        try {
            const response = await axios.get(
                `${link}/ya/playlist/${playlistId}/remove`, {headers: {"Authorization": localStorage.getItem("Authorization")}});
            console.log(response.data)
            if (response.data === "ok") {
                navigate(-1)
            }
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    }
    const fetchUserPlaylists = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/playlists`, {headers: {"Authorization": localStorage.getItem("Authorization")}});
            setUserPlaylists(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    const genresHandler = () => {

    }

    useEffect(() => {
        fetchUserPlaylists()
    }, []);


    useEffect(() => {
        fetchUserPlaylists()
        const artists = playlist.tracks.map((track) => {
            if (track.track.artists.length !== 0) {
                return track.track.artists
            }
        })
        const uniqueArtists = Array.from(new Set(artists)).flat(1)


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
            const genrePecentage = amountOfGenre.length * 100 / genres.length
            return {genre: genre, amount: amountOfGenre.length, percentage: genrePecentage}
        })
        setGenres(countAmount.sort((a, b) => b.amount - a.amount))

    }, [playlist]);

    useEffect(() => {
        const filter = filterQuery.getAll("genres")
        if (filter.length !== 0) {
            setGenresToFilter(filter)
        }
    }, [filterQuery]);


    useEffect(() => {
        if (genresToFilter.length !== 0 ) {
            setFilterQuery({genres: genresToFilter})
        }
    }, [genresToFilter]);


    return (
        <>
            <div className="playlist__popper_wrapper">
                <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <div className="track-info-mobile-control-button" onClick={(e) => {
                        setFilterMenuActive(!filterMenuActive);
                        setAnchorEl(e.currentTarget);
                    }}>
                        <>
                            <div className="track-info-mobile-control-icon">
                                <FilterAlt/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                Filter
                            </div>
                            {filterQuery.getAll("genres")?.length !== 0 ? (
                                <Button className="track-info-mobile-control-label additional" onClick={(e) => {
                                    e.stopPropagation();
                                    filterQuery.delete("genres");
                                    setFilterQuery("");
                                    setGenresToFilter([]);
                                    // setPlaylistInfoShow(false)
                                }}>
                                        <FilterAltOff/>
                                    </Button>
                            ) : null}
                        </>
                    </div>
                    {playlist.owner.uid === currentUser.user?.account?.uid && playlist.kind !== 3 ? (
                        <div className="track-info-mobile-control-button" onClick={() => {
                            // removePlaylist(playlist.kind)
                            console.log("Delete playlist")
                        }}>
                            <div className="track-info-mobile-control-icon">
                                <Delete/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                Remove playlist
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <ContextMenu active={filterMenuActive} setActive={setFilterMenuActive} position={"left-start"} anchorEl={anchorEl}>
                <PlaylistFilters genres={genres} genresToFilter={genresToFilter} setGenresToFilter={setGenresToFilter}
                                 filterQuery={filterQuery}/>
            </ContextMenu>
        </>
    )
}

interface PlaylistFiltersProps {
    genres: GenreCountT[] | undefined
    genresToFilter: string[]
    setGenresToFilter: (genres: string[]) => void
    filterQuery: URLSearchParams
}

const PlaylistFilters = ({
                             setGenresToFilter,
                             genres,
                             genresToFilter,
                             filterQuery
                         }: PlaylistFiltersProps) => {
    return (
        <>
            <div className="playlist-filter__wrapper" onClick={(e) => {
                e.stopPropagation()
            }}>
                {genres?.map(genreRender => (
                    <div key={genreRender.genre}
                         className={`playlist-filter__button  ${filterQuery.getAll("genres").includes(genreRender.genre) ? "active" : ""}`}
                         onClick={() => {
                             !filterQuery.getAll("genres")?.includes(genreRender.genre) && genreRender.genre ?
                                 // setFilterQuery({ genre: [genreRender.genre })
                                 setGenresToFilter(genresToFilter?.concat(genreRender.genre))
                                 :
                                 setGenresToFilter(genresToFilter.filter(elem => elem !== genreRender.genre))
                         }}>
                        <div
                            className="playlist-filter__button_text">{genreRender.genre ? genreRender.genre.charAt(0).toUpperCase() + genreRender.genre.slice(1) : null}</div>
                        <div className="playlist-filter__button_amount"
                             style={{width: genreRender.percentage * 100 / genres[0].percentage + "%"}}>
                            <div className="playlist-filter__button_amount_number">{genreRender.amount}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default PlaylistInfo
