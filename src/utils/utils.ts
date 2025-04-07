import {CoverT, PlaylistT, TrackT, TrackType} from "./types/types";

export function addAlpha(color:string, opacity:number) {
    opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + opacity.toString(16).toUpperCase();
}


export const getImageLink = (link:string | undefined,size:string) => {
    if (!link) return undefined
    return `https://${link.substring(0, link.lastIndexOf('/'))}/${size}`
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

export const getUniqueRandomTrackFromPlaylist = (referencePlaylist: Array<TrackT>, queueToAdd: Array<TrackT>, currentSong: TrackT) => {
    let newSong: TrackT;
    if (queueToAdd.length !== 0 && currentSong.id !== 0) {
        const index = queueToAdd.findIndex(x => x.id == currentSong.id);
        if (queueToAdd.length >= referencePlaylist.length) {
            do {
                newSong = randomSongFromTrackList(referencePlaylist)
            } while (currentSong.id == newSong.id)
        } else {
            do {
                newSong = randomSongFromTrackList(referencePlaylist)
            } while (queueToAdd.findIndex(x => x.id === newSong.id) !== -1)
        }
        return newSong
    }
}

export const randomSongFromTrackList = (trackList: Array<TrackT>) => {
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

export const getPlaylistLink = (ownerId:number,id:string) => {
    return `/users/${ownerId}/playlist/${id}`
}
export const getAlbumLink = (artistId:number,albumId:number) => {
    return `/artist/${artistId}/album/${albumId}`
}

export const playlistFromTracksArr = (tracks:TrackT[],title:string = ""):PlaylistT => {
    return {id:"",tracks:tracks,cover:{id:tracks[0]?.cover?.id ?? "", type:""},name:title,owner:{id: 0, name: "" }}
}