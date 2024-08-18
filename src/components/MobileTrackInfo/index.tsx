import React, { useEffect, useState } from "react";
import { ArtistT, TrackId, TrackT, TrackType } from "../../utils/types/types";
import { Link, useNavigation, useSearchParams } from "react-router-dom";
import { ClickAwayListener, Slide } from "@mui/material";
import { RootState, useAppSelector } from "../../store";
import { getImageLink } from "../../utils/utils";
import {
    Add, Album,
    Favorite,
    FavoriteBorder,
    FilterAlt,
    KeyboardArrowDown,
    KeyboardArrowLeft,
    PauseRounded,
    PeopleAlt,
    PlayArrowRounded,
    PlaylistAdd
} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";
import { dislikeSong, fetchLikedSongs, likeSong } from "../../utils/apiRequests";
import { MessageType, showMessage } from "../../store/MessageSlice";
import { setLikedSongs } from "../../store/LikedSongsSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { link } from "../../utils/constants";
import SongsList from "../SongsList";
import { trackArrayWrap } from "../../utils/trackWrap";
import Loader from "../Loader";
import { useLocation } from 'react-router-dom'
import { setActiveState } from "../../store/trackInfoSlice";
import CurrentSongSlice from "../../store/CurrentSongSlice";
import { addTrackToQueuePosition } from "../../store/playingQueueSlice";
import PopUpModal from "../PopUpModal";
import Cover, { ImagePlaceholder } from "../Cover";

interface SimilarTracksT {
    track: TrackT
    similarTracks: Array<TrackT>
}

const MobileTrackInfo = () => {
    const dispatch = useDispatch()
    const [params, setParams] = useSearchParams("")
    const trackInfoState = useAppSelector((state: RootState) => state.trackInfo)
    const setTrackInfoShowState = (active: boolean) => dispatch(setActiveState(active))
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const playNext = (currentSong: TrackT, songToAdd: TrackT) => dispatch(addTrackToQueuePosition({ currentSong, songToAdd }))
    const likedSongs = useAppSelector((state: RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({ message: message, track: track, type: type }))
    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        return !!likedSong
    }
    const [isLoading, setIsLoading] = useState(true)
    const [similarTracks, setSimilarTracks] = useState<SimilarTracksT>()
    const [artistsOpen, setArtistsOpen] = useState(false)
    const fetchSimilarTracks = async (id: any) => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/tracks/${id}/similar`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setSimilarTracks(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };

    const closeAll = () => {
        setArtistsOpen(false);
        setTrackInfoShowState(false);
    }

    const closeCondArtists = () => {
        if (artistsOpen) {
            setArtistsOpen(false)
        } else {
            closeAll()
        }
    }

    const updateLikedSongs = async (action: "liked" | "removed") => {
        setLikedSongsData(await fetchLikedSongs())
        if (action === "liked") setMessage(`Track ${trackInfoState.track.title} added to Liked`, trackInfoState.track, "trackLiked");
        if (action === "removed") setMessage(`Track ${trackInfoState.track.title} removed to Liked`, trackInfoState.track, "trackDisliked");
    }

    useEffect(() => {
        fetchSimilarTracks(trackInfoState.track.id)
    }, [trackInfoState.track]);

    return (
        <>

            <PopUpModal active={trackInfoState.active} setActive={closeCondArtists}>
                <>
                    {trackInfoState.track.id ? (
                        <>
                            <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
                                <Cover placeholder={<ImagePlaceholder size="medium"/>} coverUri={trackInfoState.track.coverUri} size="75x75" imageSize="200x200"/>
                                <div className="track-info-wrapper">
                                    <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{trackInfoState.track.title + `${trackInfoState.track.version ? ` (${trackInfoState.track.version})` : ""}`}</div>
                                    <div style={{ marginTop: "5px" }} className="track-info-artist">{trackInfoState.track.albums[0]?.genre}</div>
                                </div>
                                <div className="track-info-back-button">
                                    <KeyboardArrowDown className="track-info-back-icon" style={{ rotate: artistsOpen ? "90deg" : "0deg" }} />
                                </div>
                            </div>
                            <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => { e.stopPropagation() }}>
                                <div className="track-info-mobile-control-button" onClick={(e) => { isLiked(trackInfoState.track.id) ? dislikeSong(trackInfoState.track).then((response) => updateLikedSongs("removed")) : likeSong(trackInfoState.track).then((response) => updateLikedSongs("liked")); closeAll() }}>
                                    <div className="track-info-mobile-control-icon">
                                        {isLiked(trackInfoState.track.id) ? (
                                            <div
                                                className={`${isLiked(trackInfoState.track.id) ? "heart-pulse" : null}`}>
                                                <Favorite />
                                            </div>
                                        ) : (
                                            <FavoriteBorder />
                                        )}
                                    </div>
                                    <div className="track-info-mobile-control-label">
                                        Like
                                    </div>
                                </div>

                                <div className="track-info-mobile-control-button" onClick={() => { playNext(currentSong, trackInfoState.track); closeAll() }}>
                                    <div className="track-info-mobile-control-icon">
                                        <PlaylistAdd />
                                    </div>
                                    <div className="track-info-mobile-control-label">
                                        Play next
                                    </div>
                                </div>
                                {trackInfoState.track.artists.length !== 0 ? (
                                    <>
                                    <div className="track-info-mobile-control-button" onClick={() => { setArtistsOpen(true) }}>
                                        <div className="track-info-mobile-control-icon">
                                            <PeopleAlt />
                                        </div>
                                        <div className="track-info-mobile-control-label">
                                            Artists
                                        </div>
                                    </div>
                                     </>
                                ) : null}
                                    <div className="track-info-mobile-control-button">
                                    <div className="track-info-mobile-control-icon">
                                        <Add />
                                    </div>
                                    <div className="track-info-mobile-control-label">
                                        Add to playlist
                                    </div>
                                </div>
                                {trackInfoState.track.albums && trackInfoState.track.albums.length !== 0 ? (
                                    <>
                                        <Link className="track-info-mobile-control-button" style={{ textDecoration: "none" }} to={`/artist/${trackInfoState.track.albums[0].artists[0].id}/album/${trackInfoState.track.albums[0].id}`}>
                                            <div className="track-info-mobile-control-icon">
                                                <Album />
                                            </div>
                                            <div className="track-info-mobile-control-label">
                                                Album
                                            </div>
                                        </Link>
                                    </>
                                ) : null}
                                { trackInfoState.track.albums[0]?.genre ? (
                                    <div className="track-info-mobile-control-button" onClick={() => { setParams({ genre: trackInfoState.track.albums[0]?.genre }) }}>
                                    <div className="track-info-mobile-control-icon">
                                        <FilterAlt />
                                    </div>
                                    <div className="track-info-mobile-control-label">
                                        Filter by genre
                                    </div>
                                </div>
                                ) : null}


                            </div>
                            <div className="track-info-mobile-similar-tracks" onClick={(e) => { e.stopPropagation() }}>
                                {!isLoading ? (
                                    <>
                                    {similarTracks && similarTracks?.similarTracks.length !== 0 ? (
                                        <SongsList style={{ flexDirection: "row" }} playlist={{ kind: -1, cover: { uri: similarTracks.track.coverUri }, uid: 0, ogImage: similarTracks.track.coverUri, available: true, owner: { uid: similarTracks.track.artists[0].id, name: similarTracks.track.artists[0].name, verified: true }, title: `${similarTracks.track.title}: Similar`, description: "", tracks: trackArrayWrap(similarTracks.similarTracks) }} tracks={trackArrayWrap(similarTracks?.similarTracks)} />
                                    ):null}
                                </>
                                ) : (
                                        <div style={{ width: "100%", height: "45px" }}>
                                            <Loader size={50} />
                                        </div>
                                )}

                            </div>
                        </>
                    )
                        : null

                    }
                </>
            </PopUpModal>

            <PopUpModal active={trackInfoState.active && artistsOpen} setActive={setArtistsOpen}>
                <div onClick={() => { setArtistsOpen(false) }}>
                    <div className="track-info-artists-title-wrapper">
                        <div className="track-info-artists-title">Artists</div>
                    </div>
                    {trackInfoState.track.artists ? (trackInfoState.track.artists.map((artist) => (
                        <Link style={{ textDecoration: "none" }} to={`/artist/${artist.id}`}>
                            <div className="track-info-artist-info">
                                <div className="track-info-artist-avatar-wrapper">
                                    <img
                                        src={getImageLink(artist.cover?.uri, "50x50") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}
                                        alt="" loading="lazy" />
                                </div>
                                <div className="track-info-artist-info-name">{artist.name}</div>
                            </div>
                        </Link>
                    ))) : null}
                </div>
            </PopUpModal>
        </>

    )
}

export default MobileTrackInfo
