export declare type ProgressT = "same" | "up" | "down"

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

export type TrackId = {
    id: number | string,
    albumId: number | string
}

export interface TrackT {
    id:string | number
    title: string,
    artists: Array<ArtistT>,
    url: string
    coverUri: string
    chart:ChartPosT
    available:boolean
    durationMs:number
    albums:Array<AlbumT>
    version?: string
}

interface DerivedColorsT {
    accent: string,
    average: string,
    miniPlayer: string,
    waveText: string
}


export interface SearchT {
    artists:Array<ArtistT>,
    albums:Array<AlbumT>
    tracks: TracksResultSearchT
    playlists:PlaylistResultSearchT
    searchRequestId:string
    best: SearchBestT
}

export interface SearchBestT {
    result: TrackT | ArtistT
    type: "artist" | "track"
}

export type BestResultSearchT = {
    type: "track" | "playlist" | "album" | "artist",
    result: TrackType | PlaylistT | AlbumT | ArtistT
}

export type TracksResultSearchT = {
    perPage:number,
    order:number,
    total:number,
    results:Array<TrackT>
}

export type PlaylistResultSearchT = {
    perPage:number,
    order:number,
    total:number,
    results:Array<PlaylistT>
}
export interface TrackDefaultT {
    track:TrackT
}

export interface EmptyAlbumT {
    id:number
    artists:Array<ArtistT>
    coverUri: string
    title:string
    genre: string
}


export interface AlbumT extends EmptyAlbumT{
    volumes:Array<Array<TrackT>>
}

export interface ArtistT {
    id: number
    name: string,
    cover:CoverT
    likesCount: number
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
    tracks: Array<TrackType>
    title: string
    ogImage:string
    description:string
    cover:CoverT
    coverWithoutText?:CoverT
    available: boolean
    owner: OwnerT
    kind:number
    revision?: number
}

export interface QueueT {
    playlist: PlaylistT
    queueTracks:Array<TrackType>,
    queueOpen?:boolean
    filteredBy: string[]
}
