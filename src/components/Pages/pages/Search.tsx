import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { SearchT } from "../../../utils/types/types";
import SongsList from "../../SongsList";
import { trackArrayWrap } from "../../../utils/trackWrap";
import Loader from "../../Loader";
import PlaylistCard from "../../PlaylistCard";
import { Link, useSearchParams } from "react-router-dom";
import Artist from "./Artist";
import Track from "../../Track/Track";
import { getImageLink } from "../../../utils/utils";

const link = process.env.REACT_APP_YMAPI_LINK
const Search = () => {
    const [searchResults, setSearchResults] = useState<SearchT>()
    const [isLoading, setIsLoading] = useState(false)
    const input = useRef(null)
    const [search, setSearch] = useState<string>()
    const [searchQuery, setSearchQuery] = useSearchParams("")
    const handleSearch = async () => {
        setIsLoading(true)
        if (searchQuery.get("query") !== null && searchQuery.get("query") !== "") {
            console.log(searchQuery.get("query"))
            try {
                const response = await axios.get(
                    `${link}/ya/search/${searchQuery.get("query")}`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
                setSearchResults(response.data)
                setIsLoading(false)
                console.log(response.data)
            } catch (err) {
                console.error('Ошибка при получении списка треков:', err);
                console.log(err)
            }
        }
    };


    useEffect(() => {
        if (!search) return
        let Debounce = setTimeout(() => {
            setSearchQuery({ query: search })
        }, 500)
        return () => {
            clearTimeout(Debounce)
        }
    }, [search]);

    useEffect(() => {
        handleSearch()
        if (searchQuery.get("query") !== null) {
            setSearch(searchQuery?.get("query") ?? "")
        } else {
            setSearch("")
        }
    }, [searchQuery]);


    return (
        <div className="search-wrapper animated-opacity">
            <div className="searchbar">
                <div className="nav-search-icon"><SearchIcon /></div>
                <input ref={input} value={search ?? ""} className="nav-search-input" type='text'
                    onChange={(e) => {
                        setSearch(e.target.value)
                    }} />
            </div>
            {search !== "" ? (
                <div key={searchResults?.searchRequestId} className="search-results animated-opacity">
                    {!isLoading ? (
                        <>
                            <div className="nav-search-block">
                                <div className="nav-search-line">Best</div>
                                <BestResult bestResult={searchResults?.best} />
                            </div>
                            <div className="nav-search-block">
                                <div className="nav-search-line">Tracks</div>
                                {searchResults?.tracks?.results ? (
                                    <div
                                        className={searchResults.tracks.results.length % 2 === 0 ? "artist-popular-tracks-grid" : "artist-popular-tracks-flex"}>
                                        <SongsList playlist={{ kind: -1, cover: { uri: searchResults.tracks.results[0].coverUri }, uid: 0, ogImage: searchResults.tracks.results[0].coverUri, available: true, owner: { uid: searchResults.tracks.results[0].artists[0].id, name: searchResults.tracks.results[0].artists[0].name, verified: true }, title: `${" "}: Результаты`, description: "", tracks: trackArrayWrap(searchResults.tracks.results) }} tracks={trackArrayWrap(searchResults.tracks.results)} />
                                    </div>
                                ) : null}
                            </div>
                            <div className="nav-search-block">
                                <div className="nav-search-line">Albums</div>
                                <div className="playlists-wrapper">
                                    {searchResults?.playlists?.results ? (
                                        searchResults.playlists.results.map((playlist) => (
                                            <PlaylistCard playlist={playlist} />
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        </>
                    ) : <Loader />}
                </div>
            ) : <div className="search-no-search">Начните поиск</div>}

        </div>
    )
}

const BestResult = ({ bestResult }: any) => {
    const formatReturn = () => {
        if (!bestResult) return
        switch (bestResult.type) {
            case "artist": {
                return (
                    <div className="playlist-card-wrapper">
                        <Link style={{ textDecoration: "none" }} to={`/artist/${bestResult.result.id}`}>
                            <div className="playlist-card-image image-rounded">
                                <img
                                    src={getImageLink(bestResult.result.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}
                                    alt="" loading="lazy" />
                            </div>
                            <div className="playlist-card-title-wrapper">
                                <div className="playlist-card-title">{bestResult.result.name}</div>
                            </div>
                        </Link>
                    </div>
                )
            }
            case "track": {
                return <Track track={bestResult.result} />
            }
        }

    }
    return (
        <>
            {formatReturn()}
        </>
    )
}

export default Search