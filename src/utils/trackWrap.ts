import {TrackT, TrackType} from "./types/types";

type track = TrackT

export const trackWrap = (track:track) => {
    return {track:track}
}

export const trackArrayWrap = (trackArray:Array<TrackT>) => {
    return trackArray.map((track)=> {
        return {id:track.id,track:track}
    })
}