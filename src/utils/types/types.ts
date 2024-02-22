export interface Example {
    example: string
}
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

export interface ChartT {
    chart:PlaylistT,
    title:string
}

export type TrackType = TrackDefaultT | ChartTrackT

export interface TrackT {
    id:string | number
    title: string,
    artists: Array<ArtistT>,
    url: string
    coverUri: string
}

export interface TrackDefaultT {
    track:TrackT
}

export interface ArtistT {
    id: string
    name: string
}

export interface OwnerT {


}

export interface CoverT {
    uri:string
}

export interface PlaylistT {
    uid: number | string
    tracks: Array<TrackDefaultT> | Array<ChartTrackT>
    title: string
    ogImage:string
    description:string
    cover:CoverT
}