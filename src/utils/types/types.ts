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

export type DerivedColorsT = {
    average: string
    waveText: string
    miniPlayer: string
    accent: string
}

export interface TrackT {
    id: number
    title: string,
    artists: Array<ArtistT>,
    cover?: {
        id: string
    }
    genre: string
    coverUri: string
    durationMs:number
    albums:Array<AlbumT>
    version?: string
    derivedColors?: DerivedColorsT
}



export interface SearchT {
    artists:Array<ArtistT>,
    albums:Array<AlbumT>
    tracks: TracksResultSearchT
    playlists:PlaylistResultSearchT
    searchRequestId:string
    best: SearchBestT,
    text: string
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

export interface AlbumT {
    id:number
    artists:Array<ArtistT>
    cover: CoverT
    title:string
    genre: string
    year: string
    likesCount: number
    tracks:TrackT[]
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
    id: string,
    type: string
}

export interface PlaylistT {
    uid: number | string
    tracks: Array<TrackT>
    name: string
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
    queueTracks:Array<TrackT>,
    queueOpen?:boolean
    filteredBy?: string[]
}

export interface FeedT {
    generatedPlaylists: GeneratedPlaylistT[],
    days: FeedDaysT[]
}

export interface TitleT {
    type: "text" | "track" | "artist" | any
    text: string
}
export interface FeedEventsT {
    title: TitleT[]
    tracks: TrackT[]
    type: string
    id: string
}
export interface FeedDaysT {
    // TODO: Change
    events: FeedEventsT[],
    tracksToPlay: TrackT[]
}
