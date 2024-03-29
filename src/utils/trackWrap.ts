import {TrackT, TrackType} from "./types/types";

export const trackWrap = (track:TrackT) => {
    return {track:track}
}

export const trackArrayWrap = (trackArray:Array<TrackT>) => {
    return trackArray.map((track)=> {
        return {id:track.id,track:track}
    })
}