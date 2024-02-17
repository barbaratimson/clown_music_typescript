
import React, {useEffect, useState} from "react";
import axios from "axios";
import SongsList from "../../SongsList";
import Playlist from "../../Playlist";

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [chartResult,setChartResult] = useState<any>()
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
    return (
        <>
            <Playlist playlist={chartResult?.chart}/>
        </>
    )
}

export default Chart