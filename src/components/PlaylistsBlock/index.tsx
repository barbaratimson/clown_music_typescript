import {GridView, ViewAgenda} from "@mui/icons-material"
import {AlbumT, PlaylistT} from "../../utils/types/types"
import PlaylistCard from "../PlaylistCard"
import {getAlbumLink, getPlaylistLink} from "../../utils/utils";
import Button from "../UI/Button/Button";
import {getCMImageUrl} from "../../utils/cmApiRequsts";

interface PlaylistsBlockT {
    type: "grid" | "flex"
    playlists: Array<PlaylistT>
}

interface AlbumsBlockT {
    type: "grid" | "flex"
    albums: Array<AlbumT>
}

interface ControlsProps {
    active:boolean,
    setActive:Function
}

export const PlaylistsBlock = ({playlists, type}:PlaylistsBlockT) => {
    return (
        <div key={type} className={`animated-opacity-4ms ${type === "grid" ? "playlists-wrapper-grid" : "playlists-wrapper-flex"}`}>
        {playlists ? playlists.map((playlist) => (
            <PlaylistCard type={type === "grid" ? "block" : "line"} key={playlist.id} title={playlist.name} coverUri={getCMImageUrl(playlist.cover?.id, "400x400")} link={getPlaylistLink(playlist.owner.id,playlist.id)} />
        )
    ) : null}
        </div>
    )
}

export const AlbumsBlock = ({albums, type}:AlbumsBlockT) => {
    return (
        <div key={type} className={`animated-opacity-4ms ${type === "grid" ? "playlists-wrapper-grid" : "playlists-wrapper-flex"}`}>
        {albums ? albums.map(album => (
            <PlaylistCard type={type === "grid" ? "block" : "line"} key={album.id} title={album.title} coverUri={getCMImageUrl(album.cover?.id, "400x400")} link={getAlbumLink(album.artists[0].id,album.id)} />
        )) : null}
        </div>
    )
}

export const PlaylistArrangeControls = ({active, setActive}:ControlsProps) => {
    return (
                <Button key={"controls_" + active} className="change-playlist-orient" onClick={()=>{setActive(!active)}}>
                    {active ? <ViewAgenda/> : <GridView/>}
                </Button>
    )
}

