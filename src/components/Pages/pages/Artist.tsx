import {useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {AlbumT, ArtistT, TrackT} from "../../../utils/types/types";
import SongsList from "../../SongsList";
import {isElementInViewport, playlistFromTracksArr} from "../../../utils/utils";
import {deviceState, getIsMobile, handleSubscribe, onSubscribe} from "../../../utils/deviceHandler";
import {hideHeader, showHeader} from "../../../store/mobile/mobileHeaderSlice";
import {useAppDispatch} from "../../../store";
import PageHeader from "../../UI/PageHeader";
import PageBlock from "../../PageBlock";
import {AlbumsBlock, PlaylistArrangeControls} from "../../PlaylistsBlock";
import Loader from "../../UI/Loader";
import {fetchCmArtistById} from "../../../utils/cmApiRequsts";

interface ArtistResultT extends ArtistT {
    tracks: Array<TrackT>,
    albums: Array<AlbumT>

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

    const a = () => {
        if (playlistInfo.current && !isElementInViewport(playlistInfo.current) && artistResult) {
            setHeaderActive({ title: artistResult.name, imgUrl: artistResult.cover?.id })
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
            setIsLoading(true)
            fetchCmArtistById(artistId).then(result => setArtistResult(result)).finally(() => setIsLoading(false))
        }
    }, [artistId])

    useEffect(() => {
        if (artistResult?.albums && artistResult?.albums.length <= 2) setChangePlaylistView(false)
        getIsMobileInfo()
        document.addEventListener("scroll", a)
        return () => { document.removeEventListener("scroll", a); setHeaderOff() }
    }, [artistResult]);


    if (isLoading) return <Loader.PageLoader />
    return (
        <div className="page-default animated-opacity">
            {artistResult ? (
                <>
                    <PageHeader ref={playlistInfo} titleText={artistResult.name} descText={`Нравится: ${artistResult.likesCount}`} src={artistResult.cover.id} />
                    <PageBlock title="Popular tracks">
                        <div className={artistResult.tracks.length % 2 === 0 && !isMobile ? "artist-popular-tracks-grid" : "artist-popular-tracks-flex"}>
                            <SongsList playlist={playlistFromTracksArr(artistResult.tracks,artistResult.name + ": Popular")} tracks={artistResult?.tracks} />
                        </div>
                    </PageBlock>
                    <PageBlock title="Albums" controls={<PlaylistArrangeControls active={changePlaylistView} setActive={setChangePlaylistView}/>}>
                        <AlbumsBlock type={changePlaylistView ? isMobile ? "grid" : "flex" : isMobile ? "flex" : "grid"} albums={artistResult?.albums}/>
                    </PageBlock>
                </>
            ) : null}
        </div>
    )
}



export default Artist