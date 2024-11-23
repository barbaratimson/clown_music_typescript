import {CoverT, PlaylistT, TrackT, TrackType} from "./types/types";

export function addAlpha(color:string, opacity:number) {
    opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + opacity.toString(16).toUpperCase();
}

export const getImageLink = (link:string | undefined,size:string) => {
    if (!link) return undefined
    return `http://${link.substring(0, link.lastIndexOf('/'))}/${size}`
}

export function secToMinutesAndSeconds(time:number | undefined) {
    if (time){
        const minutes = Math.trunc(time / 60);
        const seconds = Math.trunc(time - minutes * 60);
        return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds).toString();
    } else {
        return '0:00'
    }
}

export const getUniqueRandomTrackFromPlaylist = (referencePlaylist: Array<TrackType>, queueToAdd: Array<TrackType>, currentSong: TrackT) => {
    let newSong: TrackType;
    if (queueToAdd.length !== 0 && currentSong.id !== 0) {
        const index = queueToAdd.findIndex(x => x.id == currentSong.id);
        if (queueToAdd.length !== referencePlaylist.length) {
            do {
                newSong = randomSongFromTrackList(referencePlaylist)
            } while (queueToAdd.findIndex(x => x.track.id === newSong.track.id) !== -1)
        } else {
            do {
                newSong = randomSongFromTrackList(referencePlaylist)
            } while (currentSong.id == newSong.track.id)
        }
        return newSong
    }
}

export const randomSongFromTrackList = (trackList: Array<TrackType>) => {
    return trackList[Math.floor((Math.random() * trackList.length))]
}

export function isElementInViewport (el:HTMLElement) {
    let rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function msToMinutesAndSeconds(time:number | undefined) {
    if (time){
        const minutes = Math.floor(time / 60000);
        const seconds = Number(((time % 60000) / 1000).toFixed(0));
        return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds).toString();
    } else {
        return '0:00'
    }
}

export const getPlaylistLink = (ownerId:number,kind:number) => {
    return `/users/${ownerId}/playlist/${kind}`
}
export const getAlbumLink = (atistId:number,albumId:number) => {
    return `/artist/${atistId}/album/${albumId}`
}

export const defaultPlaylist = (tracks:TrackType[],cover:CoverT,title:string = ""):PlaylistT => {
    return {uid:0,kind:-1,tracks:tracks,cover:cover,title:title,ogImage:cover.uri,description:"",available:true,owner:{uid: tracks[0]?.track.artists[0]?.id, name: tracks[0]?.track.artists[0].name, verified: true }}
}