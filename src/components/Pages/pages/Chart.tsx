
import React, {useEffect, useState} from "react";
import axios from "axios";
import SongsList from "../../SongsList";
import Playlist from "../../Playlist";
import {ChartT} from "../../../utils/types/types";

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [chartResult,setChartResult] = useState<ChartT>()
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
    if (isLoading) return <div>Loading</div>
    return (
        <>
            {chartResult ? (
                <Playlist playlist={chartResult.chart}/>
            ):null}
        </>
    )
}

export default Chart