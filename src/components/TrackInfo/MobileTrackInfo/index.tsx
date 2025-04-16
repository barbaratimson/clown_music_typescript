import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
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
import { MessageType, showMessage } from "../../../store/MessageSlice";
import { setLikedSongs } from "../../../store/LikedSongsSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { link } from "../../../utils/constants";
import SongsList from "../../SongsList";
import { trackArrayWrap } from "../../../utils/trackWrap";
import Loader from "../../UI/Loader";
import { setTrackInfoActiveState } from "../../../store/trackInfoSlice";
import { addTrackToQueuePosition } from "../../../store/playingQueueSlice";
import PopUpModal from "../../UI/PopUpModal";
import Cover, { ImagePlaceholder } from "../../UI/Cover";
import "./style.scss"
import PlaylistCard from "../../PlaylistCard";
import {playlistFromTracksArr} from "../../../utils/utils";
import {setIsLoading} from "../../Player/playerSlice";
import {addToCmPlaylist, fetchCmUserPlaylists, getCMImageUrl} from "../../../utils/cmApiRequsts";
import {ContextMenuElement} from "../../UI/ContextMenu/ContextMenu";

interface SimilarTracksT {
    track: TrackT
    similarTracks: Array<TrackT>
}


interface MobileTrackInfoProps {
    active: boolean,
    track: TrackT,
    setActive: Dispatch<SetStateAction<boolean>> | any
}

const MobileTrackInfo = ({active, track, setActive}: MobileTrackInfoProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [params, setParams] = useSearchParams("")
    const trackInfoState = useAppSelector((state: RootState) => state.trackInfo)
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
    const user = useAppSelector((state: RootState) => state.user.user)

    const closeAll = () => {
        setArtistsOpen(false);
        setActive(false);
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

    useEffect(()=>{
        if (!active) return
        if (!similarTracks) return
        if(similarTracks?.similarTracks?.length !== 0) {
            setShowSimilar(true)
            closeAll()
        } else {
            message("No similar tracks found")
        }
    },[similarTracks])

    useEffect(() => {
        if (!active) return
        setShowSimilar(false)
    }, [track]);

    useEffect(() => {
        closeAll()
    }, [location]);

    useEffect(() => {
        if (!active) return
        setIsLoading(true)
        fetchCmUserPlaylists(user.id).then(result => setUserPlaylists(result)).finally(() => {
            setIsLoading(false)
        })
    }, [showPlaylistsToAdd, active]);

    return (
        <>
            <PopUpModal active={active} setActive={closeCondArtists}>
                <>
                    <div className="track-info-mobile-about-wrapper">
                        <Cover placeholder={<ImagePlaceholder size="medium" />} src={getCMImageUrl(track.cover?.id,"120x120")} size="75x75" imageSize="200x200" />
                        <div className="track-info-wrapper">
                            <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{track.title + `${track.version ? ` (${track.version})` : ""}`}</div>
                            <div style={{ marginTop: "5px" }} className="track-info-artist">{track.genre}</div>
                        </div>
                        <div className="track-info-back-button">
                            <KeyboardArrowDown className="track-info-back-icon" />
                        </div>
                    </div>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => { e.stopPropagation() }}>
                        <ContextMenuElement label="Play next" icon={<PlaylistAdd />} onClick={() => { playNext(currentSong, track); closeAll() }}/>
                        {track.artists.length !== 0 ? (
                                <ContextMenuElement label=   {track.artists.length === 1 ? "Artist" : "Artists"} icon={<PeopleAlt />} onClick={() => { track.artists.length === 1 ? navigate(`/artist/${track.artists[0]?.id}`) : setArtistsOpen(true); setActive(false) }}/>
                        ) : null}
                        <ContextMenuElement label="Add to playlist" icon={ <Add />} onClick={() => {setShowPlaylistsToAdd(true); closeAll()}}/>
                        {track.album && (
                                <ContextMenuElement label="Album" icon={ <Album />} onClick={()=>{navigate(`/artist/${track.artists[0]?.id}/album/${track.album?.id}`)}}/>
                        )}
                        {track.genre ? (
                            <ContextMenuElement onClick={() => { setParams({ genres: track.genre }) }} label="Filter by genre" icon={<FilterAlt />}/>
                        ) : null}
                    </div>
                </>
            </PopUpModal>

            <PopUpModal active={artistsOpen} setActive={setArtistsOpen}>
                <>
                    <div className="track-info-mobile-about-wrapper">
                        <Cover placeholder={<ImagePlaceholder size="medium" />} src={getCMImageUrl(track.cover?.id,"120x120")} size="75x75" imageSize="200x200" />
                        <div className="track-info-wrapper">
                            <div onClick={(e) => { e.stopPropagation() }} className="track-info-title mobile">{track.title + `${track.version ? ` (${track.version})` : ""}`}</div>
                            <div style={{ marginTop: "5px" }} className="track-info-artist">{track.genre}</div>
                        </div>
                        <div className="track-info-back-button">
                            <KeyboardArrowDown className="track-info-back-icon" style={{ rotate: artistsOpen ? "90deg" : "0deg" }} />
                        </div>
                    </div>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={() => { setArtistsOpen(false) }}>
                        {track.artists ? (track.artists.map((artist) => (
                            <Link key={artist.id} className="track-info-mobile-control-button artist" style={{ textDecoration: "none" }} to={`/artist/${artist.id}`}>
                                <div className="track-info-artist-avatar-wrapper">
                                    <Cover src={getCMImageUrl(artist.cover?.id,"50x50")} size="50x50" placeholder={<ImagePlaceholder size="small" />} unWrapped />
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
                    {userPlaylists && userPlaylists.length !== 0 ? userPlaylists.map((playlist) => (
                        <div key={playlist.id} onClick={() => { addToCmPlaylist(playlist.id, [track]) }}>
                            <PlaylistCard title={playlist.name} type={"line"} coverUri={getCMImageUrl(playlist.cover?.id, "400x400")} />
                        </div>
                    )) : null}
                </>
            </PopUpModal>
        </>
    )
}

export default MobileTrackInfo
