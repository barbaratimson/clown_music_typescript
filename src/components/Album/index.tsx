import React, {useRef} from "react";
import {AlbumT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";
import SongsList from "../SongsList";
import {useAppDispatch} from "../../store";
import {trackArrayWrap} from "../../utils/trackWrap";
import {Link} from "react-router-dom";
import PageHeader from "../PageHeader";
import Cover from "../Cover";

interface AlbumProps {
    album: AlbumT
}


const Album = ({album}: AlbumProps) => {
    const dispatch = useAppDispatch()
    const playlistInfo = useRef(null)

    return (
        <div className="playlist-wrapper animated-opacity">
            <PageHeader ref={playlistInfo} descText="by" titleText={album.title} coverUri={album.coverUri}>
                 <>
                 <div className="album-artist-info-wrapper">
                 {album.artists.slice(0,2).map((artist) => (
                     <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}>
                     <div className="album-artist-info">
                         <div className="album-artist-avatar-wrapper">
                            <Cover coverUri={artist.cover.uri} size="50x50" unWrapped/>
                         </div>
                         <div className="album-artist-info-name">{artist.name}</div>
                     </div>
                     </Link>
                 ))}
             </div>
                 {album.artists.length > 2 ? (
                     <div className="album-artist-info-and">And others...</div>
                 ):null}
            </>
            </PageHeader>
            {album.volumes.map((volume)=>(
             <SongsList playlist={{kind:album.id,cover:{uri:album.coverUri},uid:0,ogImage:album.coverUri,available:true,owner:{uid:album.artists[0].id,name:album.artists[0].name,verified:true},title:album.title,description:"",tracks:trackArrayWrap(volume)}} tracks={trackArrayWrap(volume)}/>
            ))}
        </div>
    )
}

export default Album