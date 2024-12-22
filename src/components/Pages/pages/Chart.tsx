import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {ChartT, QueueT} from "../../../utils/types/types";
import Loader from "../../UI/Loader";
import {isElementInViewport} from "../../../utils/utils";
import {setQueue} from "../../../store/playingQueueSlice";
import {useAppDispatch} from "../../../store";
import {ErrCodeT, showMessage} from "../../../store/MessageSlice";
import {hideHeader, showHeader} from "../../../store/mobile/mobileHeaderSlice";
import SongsList from "../../SongsList";
import PageHeader from "../../UI/PageHeader";
import {getIsMobileInfo} from "../../../utils/deviceHandler";
import { fetchChart } from "../../../utils/apiRequests";

const link = process.env.REACT_APP_YMAPI_LINK

const Chart = () => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [chartResult, setChartResult] = useState<ChartT>()
    const setHeaderActive = (state: any) => dispatch(showHeader(state))
    const setHeaderOff = () => dispatch(hideHeader())
    const playlistInfo = useRef(null)
    const setPlayingQueue = (queue: QueueT) => dispatch(setQueue(queue))
    const setErrMessageActive = (active: boolean) => dispatch(showMessage(active))
    const setErrMessage = (message: string, code: ErrCodeT) => dispatch(showMessage({ message, code }))


    const a = () => {
        if (playlistInfo.current && !isElementInViewport(playlistInfo.current) && chartResult) {
            setHeaderActive({ title: chartResult?.chart.title })
        } else {
            setHeaderOff()
        }
    }

    useEffect(() => {
        fetchChart().then(result => setChartResult(result)).finally(() => setIsLoading(false))
    }, [])


    useEffect(() => {
        getIsMobileInfo()
        document.addEventListener("scroll", a)
        return () => { document.removeEventListener("scroll", a); setHeaderOff() }
    }, []);

    if (isLoading) return <Loader.PageLoader />

    return (
        <div className="page-default animated-opacity">
            {chartResult ? (
                <>
                    <PageHeader ref={playlistInfo} titleText={chartResult?.chart.title} descText={chartResult?.chart.description} coverUri={chartResult?.chart.cover.uri}/>

                    <SongsList playlist={chartResult.chart} tracks={chartResult.chart.tracks} />

                </>
            ) : null}
        </div>
    )
}

export default Chart