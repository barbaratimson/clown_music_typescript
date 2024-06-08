import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Loader from "../../Loader";
import {ArtistT, EmptyAlbumT, TrackT} from "../../../utils/types/types";
import SongsList from "../../SongsList";
import {getImageLink, isElementInViewport} from "../../../utils/utils";
import {trackArrayWrap} from "../../../utils/trackWrap";
import AlbumCard from "../../AlbumCard";
import {fetchLikedSongs} from "../../../utils/apiRequests";
import {deviceState, getIsMobile, handleSubscribe, onSubscribe} from "../../../utils/deviceHandler";
import {hideHeader, showHeader} from "../../../store/mobile/mobileHeaderSlice";
import {useAppDispatch} from "../../../store";

interface ArtistResultT {
    artist:ArtistT,
    popularTracks:Array<TrackT>,
    albums:Array<EmptyAlbumT>

}

const link = process.env.REACT_APP_YMAPI_LINK
const Artist = () => {
    const {artistId} = useParams()
    const dispatch = useAppDispatch()
    const [isLoading,setIsLoading] = useState(true)
    const [artistResult, setArtistResult] = useState<ArtistResultT>()
    const [isMobile, setIsMobile] = useState(false)
    const playlistInfo = useRef(null)
    const setHeaderActive = (state:any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const fetchArtist = async (artistId:string) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/artist/${artistId}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setArtistResult(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };


    //TODO: Artist disappearing from state

    const a = () => {
        if (playlistInfo.current && !isElementInViewport(playlistInfo.current) && artistResult) {
            console.log({title:artistResult.artist.name,imgUrl:artistResult.artist.cover})
            setHeaderActive({title:artistResult.artist.name,imgUrl:artistResult.artist.cover})
        } else {
            setHeaderOff()
        }
    }

    const getIsMobileInfo = () => {
        handleSubscribe()
        onSubscribe()
        setIsMobile(getIsMobile(deviceState))
    }

    useEffect(()=>{
        if (artistId) {
            fetchArtist(artistId)
        }
    },[artistId])


    useEffect(() => {
        getIsMobileInfo()
        document.addEventListener("scroll",a)
        return ()=>{document.removeEventListener("scroll",a);setHeaderOff()}
    }, []);

    if (isLoading) return <Loader />
    return (
            <div className="artist-wrapper animated-opacity">
                {artistResult ? (
                    <>
                        <div ref={playlistInfo} className="playlist">
                            <div className="playlist-cover-wrapper">
                                <img
                                    src={getImageLink(artistResult?.artist.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}
                                    alt="" loading="lazy"/>
                            </div>
                            <div className="playlist-info-wrapper">
                                <div className="artist-card-name">{artistResult?.artist.name}</div>
                                <div
                                    className="artist-card-likes-count">Нравится: {artistResult?.artist.likesCount}</div>
                            </div>
                        </div>
                        <div className="artist-block-title">Popular tracks:</div>
                        <div
                            className={artistResult.popularTracks.length % 2 === 0 && !isMobile ? "artist-popular-tracks-grid" : "artist-popular-tracks-flex"}>
                            <SongsList playlist={{kind:artistResult.artist.id,tracks:trackArrayWrap(artistResult?.popularTracks)}} tracks={trackArrayWrap(artistResult?.popularTracks)}/>
                        </div>
                        <div className="artist-block-title">Albums:</div>
                        <div className="playlists-wrapper">
                        {/*TODO:: Slice array and create button "see all"*/}
                            {artistResult.albums.map((album) => (
                                <AlbumCard key={album.id} album={album}/>
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
    )
}

export default Artist