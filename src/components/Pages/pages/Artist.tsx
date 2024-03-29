import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../../Loader";
import {ArtistT, TrackT, TrackType} from "../../../utils/types/types";
import SongsList from "../../SongsList";
import {getImageLink} from "../../../utils/utils";
import {trackArrayWrap, trackWrap} from "../../../utils/trackWrap";
import Track from "../../Track/Track";

interface ArtistResultT {
    artist:ArtistT,
    popularTracks:Array<TrackT>,

}

const link = process.env.REACT_APP_YMAPI_LINK
const PlaylistView = () => {
    const {artistId} = useParams()
    const [isLoading,setIsLoading] = useState(true)
    const [artistResult, setArtistResult] = useState<ArtistResultT>()
    const fetchArtist = async (artistId:string) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/artist/${artistId}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setArtistResult(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };


    useEffect(()=>{
        if (artistId) {
            fetchArtist(artistId)
        }
    },[])



    if (isLoading) return <Loader />
    return (
            <div className="artist-wrapper">
                {artistResult ? (
                    <>
                        <div className="artist-card-wrapper">
                 <div className="artist-cover-wrapper">
                    <img src={getImageLink(artistResult?.artist.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                 </div>
                            <div className="artist-info-wrapper">
                                <div className="artist-card-name">{artistResult?.artist.name}</div>
                                <div className="artist-card-likes-count">Нравится: {artistResult?.artist.likesCount}</div>
                        </div>
                            </div>
                        <div className="artist-block-title">Popular tracks:</div>
                        <div className="artist-popular-tracks">
                            <SongsList tracks={trackArrayWrap(artistResult?.popularTracks)}/>
                        </div>
                    </>
                ):null}
            </div>
    )
}

export default PlaylistView