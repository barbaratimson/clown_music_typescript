import React, {useRef} from "react";
import {AlbumT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";
import SongsList from "../SongsList";
import {useAppDispatch} from "../../store";
import {trackArrayWrap} from "../../utils/trackWrap";
import {Link} from "react-router-dom";

interface AlbumProps {
    album: AlbumT
}


const Album = ({album}: AlbumProps) => {
    const dispatch = useAppDispatch()
    const playlistInfo = useRef(null)

    return (
        <div className="playlist-wrapper animated-opacity">
            <div ref={playlistInfo} className="playlist">
                <div className="playlist-cover-wrapper">
                    <img src={getImageLink(album.coverUri, "600x600") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"} alt="" loading="lazy"/>
                </div>
                <div className="album-info-wrapper">
                    <div className="album-artist-info-wrapper">
                        {album.artists.map((artist) => (
                            <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}>
                            <div className="album-artist-info">
                                <div className="album-artist-avatar-wrapper">
                                    <img
                                        src={getImageLink(artist.cover.uri, "50x50") ?? "https://music.yandex.ru/blocks/playlist-cover/playlist-cover_no_cover3.png"}
                                        alt="" loading="lazy"/>
                                </div>
                                <div className="album-artist-info-name">{artist.name}</div>
                            </div>
                            </Link>
                        ))}
                    </div>
                    <div className="playlist-info-title">
                        {album.title}
                    </div>
                </div>
            </div>
            {album.volumes.map((volume)=>(
             <SongsList playlist={{kind:album.id,cover:{uri:album.coverUri},uid:0,ogImage:album.coverUri,available:true,owner:{uid:album.artists[0].id,name:album.artists[0].name,verified:true},title:album.title,description:"",tracks:trackArrayWrap(volume)}} tracks={trackArrayWrap(volume)}/>
            ))}
        </div>
    )
}

export default Album