import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import {SearchT} from "../../../utils/types/types";
import SongsList from "../../SongsList";
import { trackArrayWrap } from "../../../utils/trackWrap";
import Loader from "../../Loader";
import PlaylistCard from "../../PlaylistCard";
import {Link, useSearchParams} from "react-router-dom";
import Index from "../../Track";
import {getImageLink, getPlaylistLink} from "../../../utils/utils";
import {PlaylistsBlock} from "../../PlaylistsBlock";
import PageBlock from "../../PageBlock";
import Track from "../../Track";
import Searchbar from "../../Searchbar/Searchbar";

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
            try {
                const response = await axios.get(
                    `${link}/ya/search/${searchQuery.get("query")}`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
                setSearchResults(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error('Ошибка при получении списка треков:', err);
                console.log(err)
            }
        }
    };


    useEffect(() => {
        if (search) {
            let Debounce = setTimeout(() => {
                setSearchQuery({query: search})
            }, 500)
            return () => {
                clearTimeout(Debounce)
            }
        } else {
            setSearchQuery(undefined)
        }
    }, [search]);

    useEffect(() => {
        handleSearch()
        if (searchQuery.get("query") !== null) {
            setSearch(searchQuery?.get("query") ?? "")
        }
    }, [searchQuery]);


    return (
        <div className="page-default animated-opacity">

            <Searchbar ref={input} value={search ?? " "} setValue={setSearch}/>
            {search !== "" ? (
                <div key={searchResults?.searchRequestId} className="search-results animated-opacity">
                    {!isLoading ? (
                        <>
                            {searchResults?.best && searchResults?.best.type !== "track" ? (
                                
                                <PageBlock title="Best">
                                    <BestResult bestResult={searchResults?.best} />
                                </PageBlock>
                                ):null
                            }

                            {searchResults?.tracks?.results &&
                                <PageBlock title="Tracks">
                                    <div
                                        className={searchResults.tracks.results.length % 2 === 0 ? "artist-popular-tracks-grid" : "artist-popular-tracks-flex"}>
                                        <SongsList playlist={{ kind: -1, cover: { uri: searchResults.tracks.results[0].coverUri }, uid: 0, ogImage: searchResults.tracks.results[0].coverUri, available: true, owner: { uid: searchResults.tracks.results[0].artists[0].id, name: searchResults.tracks.results[0].artists[0].name, verified: true }, title: `${searchResults.text}: Результаты`, description: "", tracks: trackArrayWrap(searchResults.tracks.results) }} tracks={trackArrayWrap(searchResults.tracks.results)} />
                                    </div>
                                </PageBlock>
                            }

                            {searchResults?.playlists &&
                                <PageBlock title="Playlists">
                                    <PlaylistsBlock type="flex" playlists={searchResults?.playlists.results} />
                                </PageBlock>
                            }
                        </>
                    ) : <Loader.PageLoader/>}
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
            case "playlist": {
                return <PlaylistCard type="line" title={bestResult.result.title} coverUri={bestResult.result.cover.uri} link={getPlaylistLink(bestResult?.result.owner.uid,bestResult?.result.kind)}/>
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