import React, {useEffect, useRef, useState} from "react";
import {PlaylistT, TrackType} from "../../../../utils/types/types";
import {isElementInViewport} from "../../../../utils/utils";
import SongsList from "../../../SongsList";
import {RootState, useAppDispatch, useAppSelector} from "../../../../store";
import {useSearchParams} from "react-router-dom";
import {hideHeader, showHeader} from "../../../../store/mobile/mobileHeaderSlice";
import {MoreHoriz} from "@mui/icons-material";
import PageHeader from "../../../PageHeader";
import {
    setPlaylistInfo,
    setPlaylistInfoActiveState,
    setPlaylistSearchActiveState
} from "../../../../store/playlistInfoSlice";
import {ClickAwayListener, Collapse, Popover, Popper} from "@mui/material";
import "./style.scss"
import SearchIcon from "@mui/icons-material/Search";
import Searchbar from "../../../Searchbar/Searchbar";
import Button from "../../../Button/./Button";
import MobilePlaylistInfo from "../../../PlaylistInfo/MobilePlaylistInfo";
import PlaylistInfo from "../../../PlaylistInfo/PlaylistInfo";
import ContextMenu from "../../../ContextMenu/ContextMenu";

interface PlaylistProps {
    playlist: PlaylistT
}

const link = process.env.REACT_APP_YMAPI_LINK

const Playlist = ({playlist}: PlaylistProps) => {
    const dispatch = useAppDispatch()
    const setHeaderActive = (state: any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const input = useRef<HTMLInputElement>(null);
    const playlistInfo = useRef(null)
    const [tracksFiltered, setTracksFiltered] = useState<TrackType[]>()
    const [tracksSearchResult, setTracksSearchResult] = useState<TrackType[]>()
    const [filterQuery, setFilterQuery] = useSearchParams("")
    const [filterMenuActive, setFilterMenuActive] = useState(false)
    const [search, setSearch] = useState("")
    const showSearch = useAppSelector(state => state.playlistInfo.searchActive)
    const setPlaylistInfoShow = (active: boolean) => dispatch(setPlaylistInfoActiveState(active))
    const setPlaylistSearchShow = (active: boolean) => dispatch(setPlaylistSearchActiveState(active))
    const setPlaylistInfoState = (playlist: PlaylistT) => dispatch(setPlaylistInfo(playlist))

    const playlistInfoState = useAppSelector((state: RootState) => state.playlistInfo)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const searchFunc = (tracks: TrackType[]) => {
        return tracks.filter(track =>
            track.track.title.split(" ")
                .join("")
                .toLowerCase()
                .includes(search
                    .split(" ")
                    .join("")
                    .toLowerCase()) ||
            (track.track.artists.length !== 0 ?
                track.track.artists.find(artist => artist.name.split(" ")
                    .join("")
                    .toLowerCase()
                    .includes(search
                        .split(" ")
                        .join("")
                        .toLowerCase())
                ) : false))
    }

    const handleClickAway = ()=> {
        setPlaylistInfoShow(false)
    }

    useEffect(() => {
        const filter = filterQuery.getAll("genres")
        if (filter.includes("Unknown")) {
            setTracksFiltered(playlist.tracks.filter(track => track.track.albums[0]?.genre === undefined))
        } else if (filter.length !== 0) {
            setTracksFiltered(playlist.tracks.filter(track => filter.includes(track.track.albums[0]?.genre)))
        } else {
            setSearch("")
            setTracksSearchResult(undefined)
            setTracksFiltered(undefined)
        }
    }, [filterQuery]);

    useEffect(() => {
        if (search === "") {
            setTracksSearchResult(undefined)
        } else {
            setTracksSearchResult(searchFunc(tracksFiltered ?? playlist.tracks))
        }
    }, [search]);

    useEffect(() => {
        const a = () => {
            if (playlistInfo.current && !isElementInViewport(playlistInfo.current)) {
                setHeaderActive({title: playlist.title})
            } else {
                setHeaderOff()
            }
        }
        document.addEventListener("scroll", a)
        return () => {
            document.removeEventListener("scroll", a);
            setHeaderOff()
        }
    }, []);


    useEffect(() => {
        if (filterMenuActive) {
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [filterMenuActive]);

    useEffect(() => {
        if (input.current && showSearch) {
            input.current.focus()
        }
        setSearch("")
    }, [showSearch]);


    return (
        <>
            <div className="playlist-wrapper mobile-folded animated-opacity">
                <PageHeader ref={playlistInfo} titleText={playlist.title} descText={playlist.description}
                            coverUri={playlist.coverWithoutText ? playlist.coverWithoutText.uri : playlist.ogImage}
                            controls={
                                <>
                                <span className="playlist__filters">
                                    {filterQuery.getAll("genres").map((genre) => (
                                        <a key={genre}
                                           className="playlist__filters_filter-title">{genre.charAt(0).toUpperCase() + genre.slice(1)}</a>
                                    ))}
                                </span>
                                    <Button onClick={() => {
                                        setPlaylistSearchShow(!showSearch)
                                    }}>
                                        <SearchIcon/>
                                    </Button>
                                    <Button onClick={(e) => {
                                        e.stopPropagation()
                                        setPlaylistInfoShow(!playlistInfoState.active);
                                        setPlaylistInfoState(playlist);
                                        setAnchorEl(e.currentTarget);
                                    }}>
                                        <MoreHoriz/>
                                    </Button>
                                </>
                            }/>
                <Collapse in={showSearch} orientation="vertical">
                    <Searchbar ref={input} className="playlist__searchbar_noBackground" value={search}
                               setValue={setSearch}/>
                </Collapse>
                <SongsList playlist={tracksSearchResult ? {
                    ...playlist,
                    tracks: tracksSearchResult
                } : tracksFiltered ? {...playlist, tracks: tracksFiltered} : playlist}
                           tracks={tracksSearchResult ?? tracksFiltered ?? playlist.tracks}/>

                <ContextMenu active={playlistInfoState.active} position={"auto"} keepMounted setActive={setPlaylistInfoShow} anchorEl={anchorEl}>
                        <PlaylistInfo playlist={playlist}/>
                </ContextMenu>
            </div>
        </>
    )
}

export default Playlist