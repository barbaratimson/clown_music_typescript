export interface Example {
    example: string
}

export interface TrackT {
    id: string
    title: string,
    artist: ArtistT,
    url:URL
    track?:TrackT
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
    tracks: Array<TrackT>
    title: string
    ogImage:string
    description:string
}