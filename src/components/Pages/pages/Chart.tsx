import React, {useEffect, useState} from "react";
import axios from "axios";
import {ChartT, QueueT, TrackType} from "../../../utils/types/types";
import Loader from "../../Loader";
import {getImageLink} from "../../../utils/utils";
import {setQueue} from "../../../store/playingQueueSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import Track from "../../Track/Track";

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = () => {
    const dispatch = useAppDispatch()
    const [isLoading,setIsLoading] = useState(true)
    const [chartResult,setChartResult] = useState<ChartT>()
    const currentQueueId = useAppSelector((state: RootState) => state.playingQueue.queue.id)
    const setPlayingQueue = (queue: QueueT) => dispatch(setQueue(queue))
    const fetchChart = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/chart`);
            setChartResult(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    useEffect(()=>{
        fetchChart()
    },[])

    if (isLoading) return <Loader />

    return (
        <div className="playlist-wrapper animated-opacity">
            <div className="playlist">
                <div className="playlist-cover-wrapper">
                    <img src={getImageLink(chartResult?.chart.cover.uri, "200x200") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                </div>
                <div className="playlist-info-wrapper">
                    <div className="playlist-info-title">
                        {chartResult?.chart.title}
                    </div>
                    <div className="playlist-info-desc">
                        {chartResult?.chart.description}
                    </div>
                </div>
            </div>
            <div className="songs-wrapper">
                {chartResult ? chartResult.chart.tracks.map((song) => (
                    <div onClick={()=>{if (currentQueueId !== chartResult?.chart.kind) setPlayingQueue({id:chartResult?.chart.kind,queueTracks:chartResult?.chart.tracks})}} className="track-chart-wrapper">
                            <div className="track-chart-position-wrapper">
                                <div className="track-chart-position">
                                    {song.track.chart?.position}
                                </div>
                            </div>
                        <Track key={song.id} track={song.track}/>
                    </div>
                )) : null}
            </div>
        </div>
    )
}

export default Chart