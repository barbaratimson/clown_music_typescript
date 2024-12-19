import React, {useEffect, useState} from "react";
import {PlaylistT, TrackId, TrackT} from "../../utils/types/types";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {RootState, useAppSelector} from "../../store";
import {
    Add,
    Album,
    ContentCopy,
    ExpandMore,
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
} from "../../utils/apiRequests";
import {MessageType, showMessage} from "../../store/MessageSlice";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {useDispatch} from "react-redux";
import SongsList from "../SongsList";
import {trackArrayWrap} from "../../utils/trackWrap";
import Loader from "../Loader";
import {setTrackInfoActiveState} from "../../store/trackInfoSlice";
import {addTrackToQueuePosition} from "../../store/playingQueueSlice";
import PopUpModal from "../PopUpModal";
import Cover, {ImagePlaceholder} from "../Cover";
import "./TrackInfo.scss"
import PlaylistCard from "../PlaylistCard";
import {playlistFromTracksArr} from "../../utils/utils";
import ContextMenu from "../ContextMenu/ContextMenu";

interface SimilarTracksT {
    track: TrackT
    similarTracks: Array<TrackT>
}

interface TrackInfoProps {
    track: TrackT
}

const TrackInfo = ({track}: TrackInfoProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [params, setParams] = useSearchParams("")
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const playNext = (currentSong: TrackT, songToAdd: TrackT) => dispatch(addTrackToQueuePosition({currentSong, songToAdd}))
    const likedSongs = useAppSelector((state: RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setLikedMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({message: message, track: track, type: type}))
    const setMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({message: message, track: track, type: type}))
    const message = (message: string) => dispatch(showMessage({message: message}))
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
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const closeAll = () => {
        setArtistsOpen(false);
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
        if (action === "liked") setLikedMessage(`Track ${track.title} added to Liked`, track, "trackLiked");
        if (action === "removed") setLikedMessage(`Track ${track.title} removed to Liked`, track, "trackDisliked");
    }

    useEffect(() => {
        if (!similarTracks) return
        if (similarTracks?.similarTracks?.length !== 0) {
            setShowSimilar(true)
            closeAll()
        } else {
            message("No similar tracks found")
        }
    }, [similarTracks])

    useEffect(() => {
        setShowSimilar(false)
    }, [track]);

    useEffect(() => {
        closeAll()
    }, [location]);

    useEffect(() => {
        setIsLoading(true)
        fetchUserPlaylists().then(result => setUserPlaylists(result)).finally(() => {
            setIsLoading(false)
        })
    }, [showPlaylistsToAdd]);

    return (
        <>
            <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className="track-info-mobile-control-button" onClick={(e) => {
                    isLiked(track.id) ? dislikeSong(track).then((response) => updateLikedSongs("removed")) : likeSong(track).then((response) => updateLikedSongs("liked"));
                    closeAll()
                }}>
                    <div className="track-info-mobile-control-icon">
                        {isLiked(track.id) ? (
                            <div
                                className={`track-controls-button ${isLiked(track.id) ? "heart-pulse" : null}`}>
                                <Favorite/>
                            </div>
                        ) : (
                            <FavoriteBorder/>
                        )}
                    </div>
                    <div className="track-info-mobile-control-label">
                        Like
                    </div>
                </div>

                <div className="track-info-mobile-control-button" onClick={() => {
                    playNext(currentSong, track);
                    closeAll()
                }}>
                    <div className="track-info-mobile-control-icon">
                        <PlaylistAdd/>
                    </div>
                    <div className="track-info-mobile-control-label">
                        Play next
                    </div>
                </div>
                {track.artists.length !== 0 ? (
                    <>
                        <div className="track-info-mobile-control-button" onClick={(e) => {
                            track.artists.length === 1 ? navigate(`/artist/${track.artists[0]?.id}`) : setArtistsOpen(!artistsOpen); setAnchorEl(e.currentTarget)
                        }}>
                            <div className="track-info-mobile-control-icon">
                                <PeopleAlt/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                {track.artists.length === 1 ? "Artist" : "Artists"}
                            </div>
                            <div className="track-info-mobile-control-label"
                                 style={{flexGrow: "1", textAlign: "end"}}> {track.artists.length !== 1 ?
                                <KeyboardArrowDown className="track-info-back-icon"/> : null}</div>
                        </div>
                    </>
                ) : null}
                <div className="track-info-mobile-control-button"
                     onClick={(e) => {
                         setShowPlaylistsToAdd(true);
                         setAnchorEl(e.currentTarget)
                         closeAll()
                         // addToPlaylist(1040,track,1)
                     }}
                >
                    <div className="track-info-mobile-control-icon">
                        <Add/>
                    </div>
                    <div className="track-info-mobile-control-label">
                        Add to playlist
                    </div>
                </div>
                {track.albums && track.albums.length !== 0 ? (
                    <>
                        <Link className="track-info-mobile-control-button" style={{textDecoration: "none"}}
                              to={`/artist/${track.albums[0].artists[0]?.id}/album/${track.albums[0]?.id}`}>
                            <div className="track-info-mobile-control-icon">
                                <Album/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                Album
                            </div>
                        </Link>
                    </>
                ) : null}
                {track.albums[0]?.genre ? (
                    <div className="track-info-mobile-control-button" onClick={() => {
                        setParams({genres: track.albums[0]?.genre})
                    }}>
                        <div className="track-info-mobile-control-icon">
                            <FilterAlt/>
                        </div>
                        <div className="track-info-mobile-control-label">
                            Filter by genre
                        </div>
                    </div>
                ) : null}
                <div className="track-info-mobile-control-button" onClick={(e) => {
                    setIsLoading(true);
                    setAnchorEl(e.currentTarget)
                    fetchSimilarTracks(track.id).then(result => setSimilarTracks(result)).finally(() => setIsLoading(false))
                }}>
                    <div className="track-info-mobile-control-icon">
                        <ContentCopy/>
                    </div>
                    <div className="track-info-mobile-control-label">
                        Similar Tracks
                    </div>
                    <div className="track-info-mobile-control-label"
                         style={{flexGrow: "1", display: "flex", justifyContent: "end"}}>
                        <div style={{width: "30px"}}>
                            {isLoading && <Loader size={16}/>}
                        </div>
                    </div>
                </div>
            </div>

            <ContextMenu active={artistsOpen} position={"left"} anchorEl={anchorEl} setActive={setArtistsOpen}>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={() => {
                        setArtistsOpen(false)
                    }}>
                        {track.artists ? (track.artists.map((artist) => (
                            <Link key={artist.id} className="track-info-mobile-control-button artist"
                                  style={{textDecoration: "none"}} to={`/artist/${artist.id}`}>
                                <div className="track-info-artist-avatar-wrapper">
                                    <Cover coverUri={artist.cover?.uri} size="50x50"
                                           placeholder={<ImagePlaceholder size="small"/>} unWrapped/>
                                </div>
                                <div className="track-info-artist-info-name">{artist.name}</div>
                            </Link>
                        ))) : null}
                    </div>
            </ContextMenu>

            <ContextMenu active={showPlaylistsToAdd} position={"left"} anchorEl={anchorEl} setActive={setShowPlaylistsToAdd}>
                <>
                    {userPlaylists && userPlaylists.length !== 0 ? userPlaylists.filter((playlist) => playlist.kind !== 0).map((playlist) => (
                        <div key={playlist.kind} onClick={() => {
                            addToPlaylist(playlist.kind, track, playlist.revision ?? 0)
                        }}>
                            <PlaylistCard title={playlist.title} type={"line"} coverUri={playlist.cover.uri}/>
                        </div>
                    )) : null}
                </>
            </ContextMenu>

            <ContextMenu active={showSimilar} position={"left"} anchorEl={anchorEl} setActive={setShowSimilar}>
                    <div className="track-info-songs-wrapper" onClick={(e) => {
                        e.stopPropagation()
                    }} style={{maxHeight: "250px", overflowY: "scroll"}}>
                        {similarTracks && similarTracks?.similarTracks.length !== 0 ? (
                            <SongsList hideControls
                                playlist={playlistFromTracksArr(trackArrayWrap(similarTracks.similarTracks), `${similarTracks.track.title}: similar`)}
                                tracks={trackArrayWrap(similarTracks?.similarTracks)}/>
                        ) : null}
                    </div>
            </ContextMenu>
        </>
    )
}

export default TrackInfo
