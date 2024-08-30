import { useDispatch } from "react-redux"
import { RootState, useAppDispatch, useAppSelector } from "../../store"
import { MessageType, showMessage } from "../../store/MessageSlice"
import { dislikeSong, fetchLikedSongs, likeSong } from "../../utils/apiRequests"
import { TrackId, TrackT, TrackType } from "../../utils/types/types"
import { setLikedSongs } from "../../store/LikedSongsSlice"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { useState } from "react"
import Loader from "../Loader"

interface LikeButtonProps {
    track:TrackT,
    className?:string
}

const LikeButton = ({track, className}:LikeButtonProps) => {
    const dispatch = useAppDispatch()
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setTrackLikedMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({
        message: message,
        track: track,
        type: type
    }))
    const [loading,setIsLoading] = useState(false)
    
    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        console.log(!!likedSong)
        return !!likedSong
    }

    const updateLikedSongs = async (action:"liked" | "removed") => {
        setIsLoading(true)
        const likedSongsR = await fetchLikedSongs()
        if (likedSongsR) {
            setLikedSongsData(likedSongsR)
            setIsLoading(false)
        }
        if (action === "liked") setTrackLikedMessage(`Track ${track.title} added to Liked`, track, "trackLiked");
        if (action === "removed") setTrackLikedMessage(`Track ${track.title} removed to Liked`, track, "trackDisliked");
    }

    if (loading) return <div className={`track-controls-button like ${className}`}><Loader size={20}/></div>

    return (
        <>
              {isLiked(track.id) ? (
                            <div className={`track-controls-button like ${className}`} onClick={()=>{dislikeSong(track).then((response) => updateLikedSongs("removed"))}}>
                                <Favorite/>
                            </div>
                        ) : (
                            <div className={`track-controls-button like ${className}`} onClick={()=>{likeSong(track).then((response) => updateLikedSongs("liked"))}}>
                                <FavoriteBorder/>
                            </div>
                        )}
        </>
    )
}

export default LikeButton