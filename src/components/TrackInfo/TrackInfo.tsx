import React, {useEffect, useState} from "react";
import {PlaylistT, TrackId, TrackT} from "../../utils/types/types";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {RootState, useAppSelector} from "../../store";
import {
    Add,
    Album,
    ContentCopy, DeleteOutlined,
    Favorite,
    FavoriteBorder,
    FilterAlt,
    KeyboardArrowDown,
    PeopleAlt,
    PlaylistAdd
} from "@mui/icons-material";
import {MessageType, showMessage} from "../../store/MessageSlice";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {useDispatch} from "react-redux";
import SongsList from "../SongsList";
import Loader from "../UI/Loader";
import {addTrackToQueuePosition} from "../../store/playingQueueSlice";
import Cover, {ImagePlaceholder} from "../UI/Cover";
import "./TrackInfo.scss"
import PlaylistCard from "../PlaylistCard";
import {playlistFromTracksArr} from "../../utils/utils";
import {ContextMenu, ContextMenuElement} from "../UI/ContextMenu/ContextMenu";
import {addToCmPlaylist, deleteTrack, fetchCmUserPlaylists, getCMImageUrl} from "../../utils/cmApiRequsts";
import {userId} from "../../utils/constants";

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
    const user = useAppSelector((state: RootState) => state.user.user)
    const playNext = (currentSong: TrackT, songToAdd: TrackT) => dispatch(addTrackToQueuePosition({
        currentSong,
        songToAdd
    }))
    const likedSongs = useAppSelector((state: RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setLikedMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({
        message: message,
        track: track,
        type: type
    }))
    const setMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({
        message: message,
        track: track,
        type: type
    }))
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
        // setLikedSongsData(await fetchLikedSongs())
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
        fetchCmUserPlaylists(user.id).then(result => setUserPlaylists(result)).finally(() => {
            setIsLoading(false)
        })
    }, [showPlaylistsToAdd]);

    return (
        <>
            <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => {
                e.stopPropagation()
            }}>
                <ContextMenuElement icon={isLiked(track.id) ? <Favorite/> : <FavoriteBorder/>} label="Like"
                                    onClick={(e) => {
                                        // isLiked(track.id) ? dislikeSong(track).then((response) => updateLikedSongs("removed")) : likeSong(track).then((response) => updateLikedSongs("liked"));
                                        closeAll()
                                    }}/>
                <ContextMenuElement onClick={() => {
                    playNext(currentSong, track);
                    closeAll()
                }} label="Play next" icon={<PlaylistAdd/>}/>

                {track.artists.length !== 0 && (
                    <ContextMenuElement icon={<PeopleAlt/>} label={track.artists.length === 1 ? "Artist" : "Artists"}
                                        additional={track.artists.length !== 1 ?
                                            <KeyboardArrowDown className="track-info-back-icon"/> : undefined}
                                        onClick={(e) => {
                                            track.artists.length === 1 ? navigate(`/artist/${track.artists[0]?.id}`) : setArtistsOpen(!artistsOpen);
                                            setAnchorEl(e.currentTarget)
                                        }}/>
                )}
                <ContextMenuElement onClick={(e) => {
                    setShowPlaylistsToAdd(true);
                    setAnchorEl(e.currentTarget)
                    closeAll()
                }} label="Add to playlist" icon={<Add/>}/>

                {track.album && <ContextMenuElement onClick={() => {
                    navigate(`/artist/${track.album?.artists[0]?.id}/album/${track.album?.id}`)
                }} icon={<Album/>} label="Album"/>}
                {track.genre && <ContextMenuElement onClick={() => {
                    setParams({genres: track.genre})
                }} icon={<FilterAlt/>} label="Filter by genre"/>}

                {(track.uploadedBy?.id === user.id && track.source === "user-loaded") &&
                    <ContextMenuElement onClick={() => {
                        deleteTrack(track.id).then(data => console.log(data))
                    }} icon={<DeleteOutlined/>} label="Delete Track"/>
                }
            </div>

            {artistsOpen &&
                <ContextMenu active={artistsOpen} position={"left"} anchorEl={anchorEl} setActive={setArtistsOpen}>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={() => {
                        setArtistsOpen(false)
                    }}>
                        {track.artists ? (track.artists.map((artist) => (
                            <Link key={artist.id} className="track-info-mobile-control-button artist"
                                  style={{textDecoration: "none"}} to={`/artist/${artist.id}`}>
                                <div className="track-info-artist-avatar-wrapper">
                                    <Cover src={getCMImageUrl(artist.cover?.id, "120x120")} size="50x50"
                                           placeholder={<ImagePlaceholder size="small"/>} unWrapped/>
                                </div>
                                <div className="track-info-artist-info-name">{artist.name}</div>
                            </Link>
                        ))) : null}
                    </div>
                </ContextMenu>}

            {showPlaylistsToAdd && <ContextMenu active={showPlaylistsToAdd} position={"left"} anchorEl={anchorEl}
                                                setActive={setShowPlaylistsToAdd}>
                <>
                    {userPlaylists && userPlaylists.length !== 0 ? userPlaylists.map((playlist) => (
                        <div key={playlist.id}
                             onClick={() => {
                                 addToCmPlaylist(playlist.id, [track])
                             }}
                        >
                            <PlaylistCard title={playlist.name} type={"line"}
                                          coverUri={getCMImageUrl(playlist.cover?.id, "400x400")}/>
                        </div>
                    )) : null}
                </>
            </ContextMenu>}


        </>
    )
}

export default TrackInfo
