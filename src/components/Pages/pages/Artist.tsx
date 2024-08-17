import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader, { PageLoader } from "../../Loader";
import { ArtistT, EmptyAlbumT, TrackT } from "../../../utils/types/types";
import SongsList from "../../SongsList";
import { getImageLink, isElementInViewport } from "../../../utils/utils";
import { trackArrayWrap } from "../../../utils/trackWrap";
import AlbumCard from "../../AlbumCard";
import { fetchLikedSongs } from "../../../utils/apiRequests";
import { deviceState, getIsMobile, handleSubscribe, onSubscribe } from "../../../utils/deviceHandler";
import { hideHeader, showHeader } from "../../../store/mobile/mobileHeaderSlice";
import { useAppDispatch } from "../../../store";
import PageHeader from "../../PageHeader";
import PageBlock from "../../PageBlock";
import { AlbumsBlock, PlaylistArrangeControls } from "../../PlaylistsBlock";
import { GridView, Scale, ViewAgenda } from "@mui/icons-material";
import { Zoom } from "@mui/material";

interface ArtistResultT {
    artist: ArtistT,
    popularTracks: Array<TrackT>,
    albums: Array<EmptyAlbumT>

}

const link = process.env.REACT_APP_YMAPI_LINK
const Artist = () => {
    const { artistId } = useParams()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [artistResult, setArtistResult] = useState<ArtistResultT>()
    const [isMobile, setIsMobile] = useState(false)
    const playlistInfo = useRef(null)
    const [changePlaylistView, setChangePlaylistView] = useState(true)
    const setHeaderActive = (state: any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const fetchArtist = async (artistId: string) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/artist/${artistId}`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setArtistResult(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };


    //TODO: Artist disappearing from state

    const a = () => {
        if (playlistInfo.current && !isElementInViewport(playlistInfo.current) && artistResult) {
            setHeaderActive({ title: artistResult.artist.name, imgUrl: artistResult.artist.cover.uri })
        } else {
            setHeaderOff()
        }
    }

    const getIsMobileInfo = () => {
        handleSubscribe()
        onSubscribe()
        setIsMobile(getIsMobile(deviceState))
    }

    useEffect(() => {
        if (artistId) {
            fetchArtist(artistId)
        }
    }, [artistId])

    useEffect(() => {
        getIsMobileInfo()
        document.addEventListener("scroll", a)
        return () => { document.removeEventListener("scroll", a); setHeaderOff() }
    }, [artistResult]);


    if (isLoading) return <PageLoader />
    return (
        <div className="page-default animated-opacity">
            {artistResult ? (
                <>
                    <PageHeader ref={playlistInfo} titleText={artistResult.artist.name} descText={`Нравится: ${artistResult?.artist.likesCount}`} coverUri={artistResult.artist.cover.uri} />
                    <PageBlock title="Popular tracks">
                        <div className={artistResult.popularTracks.length % 2 === 0 && !isMobile ? "artist-popular-tracks-grid" : "artist-popular-tracks-flex"}>
                            <SongsList playlist={{ kind: artistResult.artist.id, cover: { uri: artistResult.artist.cover.uri }, uid: 0, ogImage: artistResult.artist.cover.uri, available: true, owner: { uid: artistResult.artist.id, name: artistResult.artist.name, verified: true }, title: `${artistResult.artist.name}: Популярное`, description: "", tracks: trackArrayWrap(artistResult?.popularTracks) }} tracks={trackArrayWrap(artistResult?.popularTracks)} />
                        </div>
                    </PageBlock>
                    <PageBlock title="Albums" controls={<PlaylistArrangeControls active={changePlaylistView} setActive={setChangePlaylistView}/>}>
                        <AlbumsBlock type={changePlaylistView ? "flex" : "grid"} albums={artistResult?.albums}/>
                    </PageBlock>
                </>
            ) : null}
        </div>
    )
}



export default Artist