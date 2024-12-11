import React, {useEffect, useRef, useState} from "react";
import {PlaylistT, QueueT, TrackType} from "../../utils/types/types";
import './style.scss'
import {initQueue} from "../../store/playingQueueSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {useSearchParams} from "react-router-dom";
import Track from "../Track";

interface SongsListProps {
    tracks: Array<TrackType>
    playlist?: PlaylistT
    style?: any,
}

const SongsList = (({ tracks, playlist, style}: SongsListProps) => {
    const dispatch = useAppDispatch()
    const setPlayingQueue = (queue: QueueT) => dispatch(initQueue(queue))
    const playerState = useAppSelector((state: RootState) => state.player)
    const [filterQuery, setFilterQuery] = useSearchParams()
    const [offset, setOffset] = useState(10)
    const [dataToShow, setDataToShow] = useState<TrackType[]>()
    const loaderRef = useRef<any>();
    const setInitQueue = (track: Array<TrackType>) => {
        if (playlist) {
            const filter = filterQuery.getAll("genres")
            if (playerState.shuffle) {
                setPlayingQueue({ playlist: playlist, queueTracks: track, filteredBy: filter ?? filter})
            } else {
                setPlayingQueue({ playlist: playlist, queueTracks: playlist.tracks, filteredBy: filter ?? filter})
            }
        }
    }

    const showNextData = (offset:number) => {
        setOffset((prevState) => prevState + 40)
        return tracks.slice(0,offset)
    }
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting) {
                // Load more planets when the loader is visible
                setDataToShow(showNextData(offset))
            }
        });
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        // Clean up the observer on component unmount
        return () => observer.disconnect();
    }, [showNextData]);

    return (
            <>
        <div style={style} className="songs-wrapper">
                {dataToShow ? dataToShow.map((song) => song.track.available ? (
                            <Track key={song.track.id} queueFunc={setInitQueue} track={song.track} />
                ) : null) : null}
        </div>
                <div ref={loaderRef} style={{width:"100%",height:"1px"}}></div>
            </>
    )
})

export default SongsList