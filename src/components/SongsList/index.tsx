import React, {memo, useEffect, useState} from "react";
import {PlaylistT, QueueT, TrackType} from "../../utils/types/types";
import Track from "../Track/Track";
import {initQueue} from "../../store/playingQueueSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import { setCurrentPlaylist } from "../../store/CurrentPlaylistSlice";
import { trackWrap } from "../../utils/trackWrap";

interface SongsListProps {
    tracks: Array<TrackType>
    playlist: PlaylistT
    style?: any
}

const SongsList = (({tracks,playlist, style}:SongsListProps) => {
    const dispatch = useAppDispatch()
    const setPlayingQueue = (queue: QueueT) => dispatch(initQueue(queue))
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const playerState = useAppSelector((state: RootState) => state.player)
    const setInitQueue = (track:Array<TrackType>) => {
        if(playerState.shuffle) {
            setPlayingQueue({playlist:playlist,queueTracks:track})
        } else {
            setPlayingQueue({playlist:playlist,queueTracks:playlist.tracks})
        }
    }
    return (
        <div style={style} className="songs-wrapper">
            {tracks ? tracks.map((song) => song.track.available ? (
                    <Track key={song.id} queueFunc={setInitQueue} track={song.track}/>
            ): null) : null}
        </div>
    )
})

export default SongsList