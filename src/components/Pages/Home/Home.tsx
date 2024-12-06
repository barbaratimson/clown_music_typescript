import React, {useEffect, useState} from "react";
import Loader from "../../Loader";
import axios from "axios";
import {FeedT, GeneratedPlaylistT} from "../../../utils/types/types";
import PageBlock from "../../PageBlock";
import {PlaylistsBlock} from "../../PlaylistsBlock";
import SongsList from "../../SongsList";
import {trackArrayWrap} from "../../../utils/trackWrap";

const link = process.env.REACT_APP_YMAPI_LINK
const Home = () => {
    const [isLoading,setIsLoading] = useState(true)
    const [feed,setFeed] = useState<FeedT>()
    const fetchFeed = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/feed`,{headers:{"Authorization":localStorage.getItem("Authorization")}});
            setFeed(response.data)
            console.log(response.data)
            setIsLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
            console.log(err)
        }
    };

    useEffect(() => {
        fetchFeed()
    }, []);

    if (isLoading) return <Loader.PageLoader/>

    return (
        <div className="page-default home-page animated-opacity">
            <div className="home-page-block">
                <div className="home-page-block-title">ClownMusic</div>
                <div className="home-page-block-desc">Yandex Music API Frontend</div>
            </div>
            <div className="home-page-block" style={{padding:"10px"}}>
                {feed?.generatedPlaylists &&
                    <PageBlock title="Daily playlists">
                        <PlaylistsBlock type="flex" playlists={feed.generatedPlaylists?.map(playlist => playlist.data)}/>
                    </PageBlock>
                }
            </div>
            {feed?.days.map(day => (
                day.events.map((event)=> event.tracks ? (
                    <PageBlock key={event.id} title={event.title.map((eventTitle => eventTitle.text)).join("").toString()}>
                        <SongsList tracks={trackArrayWrap(event.tracks)} playlist={{ kind: 0, cover: { uri: event.tracks[0].coverUri }, uid: 0, ogImage: event.tracks[0].coverUri, available: true, owner: { uid: event.tracks[0].artists[0]?.id, name: event.tracks[0].artists[0]?.name, verified: true }, title: event.title.map((eventTitle => eventTitle.text)).join("").toString(), description: "", tracks: trackArrayWrap(event.tracks) }}></SongsList>
                    </PageBlock>
                ): null)
            ))}
            <PageBlock title={"Recommended tracks"}>
                {feed?.days.map(day => (
                    <SongsList key={day.tracksToPlay[0]?.id} tracks={trackArrayWrap(day.tracksToPlay)} playlist={{ kind: 0, cover: { uri: day.tracksToPlay[0].coverUri }, uid: 0, ogImage: day.tracksToPlay[0].coverUri, available: true, owner: { uid: day.tracksToPlay[0].artists[0]?.id, name: day.tracksToPlay[0].artists[0]?.name, verified: true }, title: `Треки для вас`, description: "", tracks: trackArrayWrap(day.tracksToPlay) }}></SongsList>
                ))}
            </PageBlock>
        </div>
    )
}

export default Home