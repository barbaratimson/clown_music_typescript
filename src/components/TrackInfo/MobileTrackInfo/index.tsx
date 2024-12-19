import React, { useEffect, useState } from "react";
import { PlaylistT, TrackId, TrackT } from "../../../utils/types/types";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { RootState, useAppSelector } from "../../../store";
import {
    Add,
    Album, ContentCopy, ExpandMore,
    Favorite,
    FavoriteBorder,
    FilterAlt,
    KeyboardArrowDown,
    PeopleAlt,
    PlaylistAdd
} from "@mui/icons-material";
import {
    addToPlaylist,
    dislikeSong,
    fetchLikedSongs,
    fetchSimilarTracks,
    fetchUserPlaylists,
    likeSong
} from "../../../utils/apiRequests";
import { MessageType, showMessage } from "../../../store/MessageSlice";
import { setLikedSongs } from "../../../store/LikedSongsSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { link } from "../../../utils/constants";
import SongsList from "../../SongsList";
import { trackArrayWrap } from "../../../utils/trackWrap";
import Loader from "../../Loader";
import { setTrackInfoActiveState } from "../../../store/trackInfoSlice";
import { addTrackToQueuePosition } from "../../../store/playingQueueSlice";
import PopUpModal from "../../PopUpModal";
import Cover, { ImagePlaceholder } from "../../Cover";
import "./style.scss"
import PlaylistCard from "../../PlaylistCard";
import {playlistFromTracksArr} from "../../../utils/utils";
import {setIsLoading} from "../../Player/playerSlice";

interface SimilarTracksT {
    track: TrackT
    similarTracks: Array<TrackT>
}

const MobileTrackInfo = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [params, setParams] = useSearchParams("")
    const trackInfoState = useAppSelector((state: RootState) => state.trackInfo)
    const setTrackInfoShowState = (active: boolean) => dispatch(setTrackInfoActiveState(active))
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const playNext = (currentSong: TrackT, songToAdd: TrackT) => dispatch(addTrackToQueuePosition({ currentSong, songToAdd }))
    const likedSongs = useAppSelector((state: RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setLikedMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({ message: message, track: track, type: type }))
    const setMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({ message: message, track: track, type: type }))
    const message = (message: string) => dispatch(showMessage({ message: message }))
    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        return !!likedSong
    }
    const [isLoading, setIsLoading] = useState(true)
    const [similarTracks, setSimilarTracks] = useState<SimilarTracksT>()
    const [artistsOpen, setArtistsOpen] = useState(false)
    const [showSimilar, setShowSimilar] = useState(false)
    const [showPlaylistsToAdd, setShowPlaylistsToAdd] = useState(false)
    const [userPlaylists, setUserPlaylists] = useState<PlaylistT[]>()

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
        if (action === "liked") setLikedMessage(`Track ${trackInfoState.track.title} added to Liked`, trackInfoState.track, "trackLiked");
        if (action === "removed") setLikedMessage(`Track ${trackInfoState.track.title} removed to Liked`, trackInfoState.track, "trackDisliked");
    }

    useEffect(()=>{
        if (!similarTracks) return
        if(similarTracks?.similarTracks?.length !== 0) {   
            setShowSimilar(true)
            closeAll()
        } else {
            message("No similar tracks found")
        }
    },[similarTracks])

    useEffect(() => {
        setShowSimilar(false)
    }, [trackInfoState.track]);

    useEffect(() => {
        closeAll()
    }, [location]);

    useEffect(() => {
        setIsLoading(true)
        fetchUserPlaylists().then(result => setUserPlaylists(result)).finally(()=>{setIsLoading(false)})
    }, [showPlaylistsToAdd]);

    return (
        <>
            <PopUpModal active={trackInfoState.active} setActive={closeCondArtists}>
                <>
                    <div className="track-info-mobile-about-wrapper">
                        <Cover placeholder={<ImagePlaceholder size="medium" />} coverUri={trackInfoState.track.coverUri} size="75x75" imageSize="200x200" />
                        <div className="track-info-wrapper">
                            <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{trackInfoState.track.title + `${trackInfoState.track.version ? ` (${trackInfoState.track.version})` : ""}`}</div>
                            <div style={{ marginTop: "5px" }} className="track-info-artist">{trackInfoState.track.albums[0]?.genre}</div>
                        </div>
                        <div className="track-info-back-button">
                            <KeyboardArrowDown className="track-info-back-icon" />
                        </div>
                    </div>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => { e.stopPropagation() }}>
                        <div className="track-info-mobile-control-button" onClick={(e) => { isLiked(trackInfoState.track.id) ? dislikeSong(trackInfoState.track).then((response) => updateLikedSongs("removed")) : likeSong(trackInfoState.track).then((response) => updateLikedSongs("liked")); closeAll() }}>
                            <div className="track-info-mobile-control-icon">
                                {isLiked(trackInfoState.track.id) ? (
                                    <div
                                        className={`track-controls-button ${isLiked(trackInfoState.track.id) ? "heart-pulse" : null}`}>
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
                                <div className="track-info-mobile-control-button" onClick={() => { trackInfoState.track.artists.length === 1 ? navigate(`/artist/${trackInfoState.track.artists[0]?.id}`) : setArtistsOpen(true); setTrackInfoShowState(false) }}>
                                    <div className="track-info-mobile-control-icon">
                                        <PeopleAlt />
                                    </div>
                                    <div className="track-info-mobile-control-label">
                                        {trackInfoState.track.artists.length === 1 ? "Artist" : "Artists"}
                                    </div>
                                    <div className="track-info-mobile-control-label" style={{ flexGrow: "1", textAlign: "end" }}> {trackInfoState.track.artists.length !== 1 ? <KeyboardArrowDown className="track-info-back-icon" /> : null}</div>
                                </div>
                            </>
                        ) : null}
                        <div className="track-info-mobile-control-button"
                            onClick={() => {
                                setShowPlaylistsToAdd(true); closeAll()
                                // addToPlaylist(1040,trackInfoState.track,1)
                            }}
                        >
                            <div className="track-info-mobile-control-icon">
                                <Add />
                            </div>
                            <div className="track-info-mobile-control-label">
                                Add to playlist
                            </div>
                        </div>
                        {trackInfoState.track.albums && trackInfoState.track.albums.length !== 0 ? (
                            <>
                                <Link className="track-info-mobile-control-button" style={{ textDecoration: "none" }} to={`/artist/${trackInfoState.track.albums[0].artists[0]?.id}/album/${trackInfoState.track.albums[0]?.id}`}>
                                    <div className="track-info-mobile-control-icon">
                                        <Album />
                                    </div>
                                    <div className="track-info-mobile-control-label">
                                        Album
                                    </div>
                                </Link>
                            </>
                        ) : null}
                        {trackInfoState.track.albums[0]?.genre ? (
                            <div className="track-info-mobile-control-button" onClick={() => { setParams({ genres: trackInfoState.track.albums[0]?.genre }) }}>
                                <div className="track-info-mobile-control-icon">
                                    <FilterAlt />
                                </div>
                                <div className="track-info-mobile-control-label">
                                    Filter by genre
                                </div>
                            </div>
                        ) : null}
                        <div className="track-info-mobile-control-button" onClick={()=>{setIsLoading(true);fetchSimilarTracks(trackInfoState.track.id).then(result => setSimilarTracks(result)).finally(() => setIsLoading(false))}}>
                            <div className="track-info-mobile-control-icon">
                                <ContentCopy />
                            </div>
                            <div className="track-info-mobile-control-label">
                                Similar Tracks
                            </div>
                            <div className="track-info-mobile-control-label" style={{ flexGrow: "1", display: "flex", justifyContent:"end"}}> 
                                <div style={{width:"30px"}}>
                                    {isLoading && <Loader size={16}/>}
                                </div>
                                </div>
                        </div>
                    </div>
                </>
            </PopUpModal>

            <PopUpModal active={artistsOpen} setActive={setArtistsOpen}>
                <>
                    <div className="track-info-mobile-about-wrapper">
                        <Cover placeholder={<ImagePlaceholder size="medium" />} coverUri={trackInfoState.track.coverUri} size="75x75" imageSize="200x200" />
                        <div className="track-info-wrapper">
                            <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{trackInfoState.track.title + `${trackInfoState.track.version ? ` (${trackInfoState.track.version})` : ""}`}</div>
                            <div style={{ marginTop: "5px" }} className="track-info-artist">{trackInfoState.track.albums[0]?.genre}</div>
                        </div>
                        <div className="track-info-back-button">
                            <KeyboardArrowDown className="track-info-back-icon" style={{ rotate: artistsOpen ? "90deg" : "0deg" }} />
                        </div>
                    </div>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={() => { setArtistsOpen(false) }}>
                        {trackInfoState.track.artists ? (trackInfoState.track.artists.map((artist) => (
                            <Link key={artist.id} className="track-info-mobile-control-button artist" style={{ textDecoration: "none" }} to={`/artist/${artist.id}`}>
                                <div className="track-info-artist-avatar-wrapper">
                                    <Cover coverUri={artist.cover?.uri} size="50x50" placeholder={<ImagePlaceholder size="small" />} unWrapped />
                                </div>
                                <div className="track-info-artist-info-name">{artist.name}</div>
                            </Link>
                        ))) : null}
                    </div>
                </>
            </PopUpModal>

            <PopUpModal active={showPlaylistsToAdd} setActive={setShowPlaylistsToAdd}>
                <>
                    <div className="playlist-add__title"><ExpandMore /></div>
                    {userPlaylists && userPlaylists.length !== 0 ? userPlaylists.filter((playlist) => playlist.kind !== 0).map((playlist) => (
                        <div key={playlist.kind} onClick={() => { addToPlaylist(playlist.kind, trackInfoState.track, playlist.revision ?? 0) }}>
                            <PlaylistCard title={playlist.title} type={"line"} coverUri={playlist.cover.uri} />
                        </div>
                    )) : null}
                </>
            </PopUpModal>
            <PopUpModal active={showSimilar} setActive={setShowSimilar}>
                <>
                    <div className="track-info-mobile-about-wrapper">
                        <Cover placeholder={<ImagePlaceholder size="medium" />} coverUri={trackInfoState.track.coverUri} size="75x75" imageSize="200x200" />
                        <div className="track-info-wrapper">
                            <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{trackInfoState.track.title + `${trackInfoState.track.version ? ` (${trackInfoState.track.version})` : ""}`}</div>
                            <div style={{ marginTop: "5px" }} className="track-info-artist">{`${similarTracks?.similarTracks.length} similar`}</div>
                        </div>
                        <div className="track-info-back-button">
                            <KeyboardArrowDown className="track-info-back-icon" style={{ rotate: showSimilar ? "90deg" : "0deg" }} />
                        </div>
                    </div>
                    <div className="track-info-songs-wrapper" onClick={(e)=>{e.stopPropagation()}} style={{maxHeight:"250px", overflowY:"scroll"}}>
                        {similarTracks && similarTracks?.similarTracks.length !== 0 ? (
                            <SongsList playlist={playlistFromTracksArr(trackArrayWrap(similarTracks.similarTracks), `${similarTracks.track.title}: similar`)} tracks={trackArrayWrap(similarTracks?.similarTracks)} />
                        ) : null}
                    </div>
                </>
            </PopUpModal>
        </>
    )
}

export default MobileTrackInfo
