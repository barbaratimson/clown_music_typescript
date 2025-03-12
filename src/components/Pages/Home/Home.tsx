import React, {useEffect, useState} from "react";
import Loader from "../../UI/Loader";
import axios from "axios";
import {FeedT, GeneratedPlaylistT, TrackT} from "../../../utils/types/types";
import PageBlock from "../../PageBlock";
import {PlaylistsBlock} from "../../PlaylistsBlock";
import SongsList from "../../SongsList";
import {trackArrayWrap} from "../../../utils/trackWrap";
import {fetchRecentTracks} from "../../../utils/cmApiRequsts";
import {playlistFromTracksArr} from "../../../utils/utils";

const link = process.env.REACT_APP_YMAPI_LINK
const Home = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [recentTracks,setRecentTracks] = useState<TrackT[]>([])

    useEffect(() => {
        setIsLoading(true)
        fetchRecentTracks().then(data => setRecentTracks(data)).finally(()=>{setIsLoading(false)})
    }, []);

    if (isLoading) return <Loader.PageLoader/>

    return (
        <div className="page-default home-page animated-opacity">
            <div className="home-page-block">
                <div className="home-page-block-title">ClownMusic</div>
                <div className="home-page-block-desc">the most clownish music service</div>
            </div>
            {recentTracks &&
            <PageBlock title={"Uploaded recently"}>
                    <SongsList tracks={recentTracks} playlist={playlistFromTracksArr(recentTracks, "Feed: Recent")}></SongsList>
            </PageBlock>
            }
        </div>
    )
}

export default Home