import React, {useEffect, useRef, useState} from "react";
import {AlbumT, PlaylistT, QueueT, TrackT, TrackType} from "../../utils/types/types";
import './style.scss'
import {initQueue} from "../../store/playingQueueSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {useSearchParams} from "react-router-dom";
import Track from "../Track";

interface SongsListProps {
    tracks: Array<TrackT>
    playlist?: PlaylistT
    style?: any,
    hideControls?: boolean
}

const SongsList = (({ tracks, playlist, style, hideControls}: SongsListProps) => {
    const dispatch = useAppDispatch()
    const setPlayingQueue = (queue: QueueT) => dispatch(initQueue(queue))
    const playerState = useAppSelector((state: RootState) => state.player)
    const [filterQuery, setFilterQuery] = useSearchParams()
    const [offset, setOffset] = useState(20)
    const [dataToShow, setDataToShow] = useState<TrackT[]>([])
    const loaderRef = useRef<any>();
    const setInitQueue = (tracks: Array<TrackT>) => {
        if (playlist) {
            const filter = filterQuery.getAll("genres")
            if (playerState.shuffle) {
                setPlayingQueue({ playlist: playlist, queueTracks: tracks, filteredBy: filter ?? filter})
            } else {
                setPlayingQueue({ playlist: playlist, queueTracks: playlist.tracks, filteredBy: filter ?? filter})
            }
        }
    }

    const showNextData = (offset:number) => {
        if (offset <= tracks.length) {
            setOffset((prevState) => prevState + 40)
            return tracks.slice(0, offset)
        } else {
            return tracks
        }
    }

    useEffect(() => {
        setOffset(20)
        if (playlist?.tracks) {
            setDataToShow(playlist?.tracks.slice(0,20))
        }
    }, [tracks]);
    
    useEffect(() => {
            const observer = new IntersectionObserver((entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting) {
                    setDataToShow(showNextData(offset))
                }
            });
            if (loaderRef.current) {
                observer.observe(loaderRef.current);
            }
            return () => observer.disconnect();
    }, [showNextData]);

    return (
            <>
                <div key={tracks[0]?.id} className="songs-wrapper">
                        {dataToShow ? dataToShow.map((song) => (
                                    <Track hideControls={hideControls} key={song.id} queueFunc={setInitQueue} track={song} />
                        )) : null}
                </div>
                <div ref={loaderRef} style={{width:"100%",height:dataToShow?.length !== tracks.length ? "2400px" : 0}}></div>
            </>
    )
})

export default SongsList