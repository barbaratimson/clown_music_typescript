import React, {useEffect} from "react";
import {ChartTrackT, TrackT, TrackType} from "../../utils/types/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong, updateSongLink} from "../../store/CurrentSongSlice";
import axios from "axios";
import {playerStart, playerStop, setCurrentTime, setIsLoading, setSrc} from "../../store/PlayerSlice";

const link = process.env.REACT_APP_YMAPI_LINK

interface TrackProps {
    track : TrackType
}

interface TrackDefaultProps {
    track: TrackT
}
interface TrackInChartProps {
    track:ChartTrackT
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
    if ('chart' in track) {
        return (
           <TrackInChart track={track}/>
        )
    } else {
        return (
            <TrackDefault track={track}/>
        )
    }
}

const TrackInChart = ({track}:TrackInChartProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const setPlayerSrc = (link:string) => dispatch(setSrc(link))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const changePlayerTime = (time:number) => dispatch(setCurrentTime(time))
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
        <div className="track-wrapper"  onClick={()=>{changeSong(track.track)}}>
            <div className="track-cover-wrapper">

            </div>
            <div className="track-info-wrapper" style={{color:`${currentSong.id === track.track.id ? "red" : "green"}`}}>
                {track.track.title}
            </div>
            <div className="track-controls-wrapper"></div>
        </div>
    )
}

const TrackDefault = ({track}:TrackDefaultProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const setCurrentSong = (track:TrackT) => dispatch(changeCurrentSong(track))
    return (
        <div>
            {track.title}
        </div>
    )
}

export default Track