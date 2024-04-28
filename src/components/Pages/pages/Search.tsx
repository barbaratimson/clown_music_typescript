import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import {SearchT} from "../../../utils/types/types";
import SongsList from "../../SongsList";
import {trackArrayWrap} from "../../../utils/trackWrap";
import Loader from "../../Loader";
import PlaylistCard from "../../PlaylistCard";
import {useSearchParams} from "react-router-dom";

const link = process.env.REACT_APP_YMAPI_LINK
const Search = () => {
    const [searchResults,setSearchResults] = useState<SearchT>()
    const [isLoading,setIsLoading] = useState(false)
    const input = useRef(null)
    const [search,setSearch] = useState("")
    const [searchQuery,setSearchQuery] = useSearchParams("")
    const handleSearch = async () => {
        setIsLoading(true)
        if (searchQuery.get("query") !== null && searchQuery.get("query") !== ""){
            console.log(searchQuery.get("query"))
            try {
                const response = await axios.get(
                    `${link}/ya/search/${searchQuery.get("query")}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
                setSearchResults(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error('Ошибка при получении списка треков:', err);
                console.log(err)
            }
        }
    };


    useEffect(() => {
        let Debounce = setTimeout(()=>{
            setSearchQuery({query:search})
        },500)
        return () => {
            clearTimeout(Debounce)
        }
    }, [search]);

    useEffect(() => {
        handleSearch()
        if (searchQuery.get("query") !== null) {
            setSearch(searchQuery?.get("query") ?? "")
        }
    }, [searchQuery]);


    return (
        <div className="search-wrapper animated-opacity">
            <div className="searchbar">
                <div className="nav-search-icon"><SearchIcon/></div>
                <input ref={input} value={search ?? ""} className="nav-search-input" type='text'
                       onChange={(e) => {
                          setSearch(e.target.value)
                       }}/>
            </div>
            {search !== "" ? (
                <div key={searchResults?.searchRequestId} className="search-results animated-opacity">
                    {!isLoading ? (
                        <>
                            <div className="nav-search-line">Tracks</div>
                            {searchResults?.tracks?.results ? (
                                <div
                                    className={searchResults.tracks.results.length % 2 === 0 ? "artist-popular-tracks-grid" : "artist-popular-tracks-flex"}>
                                <SongsList playlistId={searchResults.searchRequestId} tracks={trackArrayWrap(searchResults.tracks.results)}/>
                                </div>
                            ) : null}
                            <div className="nav-search-line">Albums</div>
                            <div className="playlists-wrapper">
                            {searchResults?.playlists?.results ? (
                                searchResults.playlists.results.map((playlist)=>(
                                    <PlaylistCard playlist={playlist}/>
                                ))
                            ) : null}
                            </div>
                        </>
                    ) : <Loader/>}
                </div>
            ):<div className="search-no-search">Начните поиск</div>}

        </div>
    )
}

export default Search