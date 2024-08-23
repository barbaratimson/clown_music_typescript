import { GridView, ViewAgenda } from "@mui/icons-material"
import { AlbumT, EmptyAlbumT, PlaylistT } from "../../utils/types/types"
import PlaylistCard from "../PlaylistCard"
import {getAlbumLink} from "../../utils/utils";

interface PlaylistsBlockT {
    type: "grid" | "flex"
    playlists: Array<PlaylistT>
}

interface AlbumsBlockT {
    type: "grid" | "flex"
    albums: Array<EmptyAlbumT>
}

interface ControlsProps {
    active:boolean,
    setActive:Function
}

export const PlaylistsBlock = ({playlists, type}:PlaylistsBlockT) => {
    return (
        <div key={type} className={`animated-opacity-4ms ${type === "grid" ? "playlists-wrapper-grid" : "playlists-wrapper-flex"}`}>
        {playlists ? playlists.map((playlist) => playlist.kind !== 0 ? (
            <PlaylistCard type={type === "grid" ? "block" : "line"} key={playlist.kind} title={playlist.title} coverUri={playlist.cover.uri} link={`/users/${playlist.owner.uid}/playlist/${playlist.kind}`} />
        ) : null
    ) : null}
        </div>
    )
}

export const AlbumsBlock = ({albums, type}:AlbumsBlockT) => {
    return (
        <div key={type} className={`animated-opacity-4ms ${type === "grid" ? "playlists-wrapper-grid" : "playlists-wrapper-flex"}`}>
        {albums ? albums.map(album => (
            <PlaylistCard type={type === "grid" ? "block" : "line"} key={album.id} title={album.title} coverUri={album.coverUri} link={getAlbumLink(album.artists[0].id,album.id)} />
        )) : null}
        </div>
    )
}

export const PlaylistArrangeControls = ({active, setActive}:ControlsProps) => {
    return (
                <div key={"controls_" + active} className="change-playlist-orient" onClick={()=>{setActive(!active)}}>
                    {active ? <ViewAgenda/> : <GridView/>}
                </div>
    )
}

