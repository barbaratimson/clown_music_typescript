import React, {useEffect} from "react";
import {ChartTrackT, TrackDefaultT, TrackT, TrackType} from "../../utils/types/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong, updateSongLink} from "../../store/CurrentSongSlice";
import axios from "axios";
import {playerSeekTo, playerStart, playerStop, setIsLoading, setSrc} from "../../store/PlayerSlice";
import {getImageLink} from "../../utils/utils";

const link = process.env.REACT_APP_YMAPI_LINK

interface TrackProps {
    track : TrackType
}

const fetchYaSongLink = async (id:string | number) => {
    try {
        const response = await axios.get(
            `${link}/ya/tracks/${id}`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
        return response.data
    } catch (err) {
        console.error('Ошибка при получении списка треков:', err);
        console.log(err)
    }
};
const Track = ({track}:TrackProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const setPlayerSrc = (link:string) => dispatch(setSrc(link))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const changePlayerTime = (time:number) => dispatch(playerSeekTo(time))
    const setCurrentSong = (track:TrackT) => dispatch(changeCurrentSong(track))

    const setLoading = (loading:boolean) => dispatch(setIsLoading(loading))

    const changeSong = async (song:TrackT) => {
        setLoading(true)
        stopPlayerFunc()
        changePlayerTime(0)
        setCurrentSong(song)
        setPlayerSrc(await fetchYaSongLink(song.id))
        startPlayerFunc()
    }



    return (
        <div className="track-chart-wrapper">
            {track.chart ? (
                <div className="track-chart-position-wrapper">
                    <div className="track-chart-position">
                        {track.chart.position}
                    </div>
                </div>
            ) : null}
            <div className={`track-wrapper ${currentSong.id == track.track.id ? "track-current" : ""}`}   onClick={()=>{changeSong(track.track)}}>
                <div className="track-cover-wrapper">
                    <img src={getImageLink(track.track.coverUri,"200x200")} loading="lazy" alt=""/>
                </div>
                <div className="track-info-wrapper">
                    <div className="track-info-title">{track.track.title}</div>
                    <div className="track-info-artists-wrapper">
                        {track.track.artists.map(artist => (
                            <div className="track-info-artist">{artist.name}</div>
                        ))}
                    </div>
                </div>
                <div className="track-controls-wrapper"></div>
            </div>
        </div>
    )
}


// const TrackDefault = ({track}:TrackDefaultProps) => {
//     const dispatch = useAppDispatch()
//     const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
//     const setPlayerSrc = (link:string) => dispatch(setSrc(link))
//     const stopPlayerFunc = () => dispatch(playerStop())
//     const startPlayerFunc = () => dispatch(playerStart())
//     const changePlayerTime = (time:number) => dispatch(playerSeekTo(time))
//     const setCurrentSong = (track:TrackT) => dispatch(changeCurrentSong(track))
//
//     const setLoading = (loading:boolean) => dispatch(setIsLoading(loading))
//
//     const changeSong = async (song:TrackT) => {
//         setLoading(true)
//         stopPlayerFunc()
//         changePlayerTime(0)
//         setCurrentSong(song)
//         setPlayerSrc(await fetchYaSongLink(song.id))
//         startPlayerFunc()
//     }
//
//
//
//     return (
//         <div className={`track-wrapper ${currentSong.id == track.track.id ? "track-current" : ""}`}   onClick={()=>{changeSong(track.track)}}>
//             <div className="track-cover-wrapper">
//                 <img src={getImageLink(track.track.coverUri,"200x200")} loading="lazy" alt=""/>
//             </div>
//             <div className="track-info-wrapper">
//                 <div className="track-info-title">{track.track.title}</div>
//                 <div className="track-info-artists-wrapper">
//                     {track.track.artists.map(artist => (
//                         <div className="track-info-artist">{artist.name}</div>
//                     ))}
//                 </div>
//             </div>
//             <div className="track-controls-wrapper"></div>
//         </div>
//     )
// }

export default Track