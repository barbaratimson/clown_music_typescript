
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import {SearchT} from "../../../utils/types/types";
import SongsList from "../../SongsList";
import {trackArrayWrap} from "../../../utils/trackWrap";
import Loader from "../../Loader";
import PlaylistCard from "../../PlaylistCard";
import {useParams, useSearchParams} from "react-router-dom";

const link = process.env.REACT_APP_YMAPI_LINK
const Search = () => {
    // const [search,setSearch] = useState("")
    const [searchResults,setSearchResults] = useState<SearchT>()
    const [isLoading,setIsLoading] = useState(false)
    const input = useRef(null)
    const [search,setSearch] = useSearchParams()
    const handleSearch = async () => {
        setIsLoading(true)
        if (search){
            try {
                const response = await axios.get(
                    `${link}/ya/search/${search.get("query")}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
                setSearchResults(response.data)
                console.log(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error('Ошибка при получении списка треков:', err);
                console.log(err)
            }
        }
    };


    useEffect(() => {
        let Debounce = setTimeout(()=>{
            handleSearch()
        },350)
        return () => {
            clearTimeout(Debounce)
        }
    }, [search]);


    return (
        <div className="search-wrapper animated-opacity">
            <div className="searchbar">
                <div className="nav-search-icon"><SearchIcon/></div>
                <input ref={input} value={search.get("query") ?? ""} className="nav-search-input" type='text'
                       onChange={(e) => {
                           setSearch({query:e.target.value})
                       }}/>
            </div>
            {search.get("query") !== "" ? (
                <div key={searchResults?.searchRequestId} className="search-results animated-opacity">
                    {!isLoading ? (
                        <>
                            <div className="nav-search-line">Tracks</div>
                            {searchResults?.tracks?.results ? (
                                <SongsList tracks={trackArrayWrap(searchResults.tracks.results)}/>
                            ) : null}
                            <div className="nav-search-line">Albums</div>
                            {searchResults?.playlists?.results ? (
                                searchResults.playlists.results.map((playlist)=>(
                                    <PlaylistCard playlist={playlist}/>
                                ))
                            ) : null}
                        </>
                    ) : <Loader/>}
                </div>
            ):<div className="search-no-search">Начните поиск</div>}

        </div>
    )
}

export default Search