import exp from "constants";

export type ProgressT = "same" | "up" | "down"

export interface ChartPosT {
        bgColor:string
        listeners: number
        position: number
        progress: ProgressT
        shift:number
    }

export interface ChartTrackT {
    id: number | string
    chart: ChartPosT
    track: TrackT
}

export interface GeneratedPlaylistT {
    data:PlaylistT
}


export interface ChartT {
    chart:PlaylistT,
    title:string
}

export type TrackType = {
    id: number | string,
    track:TrackT,
    chart?:ChartPosT
}

export interface TrackT {
    id:string | number
    title: string,
    artists: Array<ArtistT>,
    url: string
    coverUri: string
    chart:ChartPosT
}

export interface TrackDefaultT {
    track:TrackT
}

export interface ArtistT {
    id: string
    name: string,

}

export interface OwnerT {
    name:string
    uid:number
    verified: boolean
}

export interface CoverT {
    uri:string
}

export interface PlaylistT {
    uid: number | string
    tracks: Array<TrackT>
    title: string
    ogImage:string
    description:string
    cover:CoverT
    available: boolean
    owner: OwnerT
    kind:number
}