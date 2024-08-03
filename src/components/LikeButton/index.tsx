import { useDispatch } from "react-redux"
import { RootState, useAppDispatch, useAppSelector } from "../../store"
import { showMessage } from "../../store/MessageSlice"
import { dislikeSong, fetchLikedSongs, likeSong } from "../../utils/apiRequests"
import { TrackId, TrackT, TrackType } from "../../utils/types/types"
import { setLikedSongs } from "../../store/LikedSongsSlice"
import { Favorite, FavoriteBorder } from "@mui/icons-material"

interface LikeButtonProps {
    track:TrackT
}

const LikeButton = ({track}:LikeButtonProps) => {
    const dispatch = useAppDispatch()
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const trackAddedMessage = (message:string) => dispatch(showMessage({message:message}))
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    
    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        console.log(!!likedSong)
        return !!likedSong
    }

    const updateLikedSongs = async (action:"liked" | "removed") => {
        setLikedSongsData( await fetchLikedSongs())
        if (action === "liked") trackAddedMessage(`Track ${track.title} added to Liked`);
        if (action === "removed") trackAddedMessage(`Track ${track.title} removed to Liked`);
    }

    return (
        <>
              {isLiked(track.id) ? (
                            <div className={`track-controls-button like`} onClick={()=>{dislikeSong(track).then((response) => updateLikedSongs("removed"))}}>
                                <Favorite/>
                            </div>
                        ) : (
                            <div className={`track-controls-button like`} onClick={()=>{likeSong(track).then((response) => updateLikedSongs("liked"))}}>
                                <FavoriteBorder/>
                            </div>
                        )}
        </>
    )
}

export default LikeButton