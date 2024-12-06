import React, {useRef, useState} from "react";
import {AlbumT, PlaylistT} from "../../utils/types/types";
import SongsList from "../SongsList";
import {useAppDispatch} from "../../store";
import {trackArrayWrap} from "../../utils/trackWrap";
import {Link} from "react-router-dom";
import PageHeader from "../PageHeader";
import Cover from "../Cover";
import {MoreVert} from "@mui/icons-material";
import PopUpModal from "../PopUpModal";
import {setPlaylistInfo} from "../../store/playlistInfoSlice";
import playlist from "../Playlist";
import MobileAlbumInfo from "../PopUpModal/MobileAlbumInfo";

interface AlbumProps {
    album: AlbumT
}


const Album = ({album}: AlbumProps) => {
    const dispatch = useAppDispatch()
    const playlistInfo = useRef(null)
    const [showMenu, setShowMenu] = useState(false)
    return (
        <>
        <div className="playlist-wrapper animated-opacity">
            <PageHeader ref={playlistInfo} titleText={album.title} coverUri={album.coverUri} controls={
                <>
                <div style={{flexGrow:"1"}}>
                    <div className="album-artist-info-wrapper">
                        <Link style = {{textDecoration:"none"}} to={`/artist/${album.artists[0].id}`}>
                            <div className="album-artist-info">
                                <div className="album-artist-avatar-wrapper">
                                    <Cover coverUri={album.artists[0].cover.uri} size="50x50" unWrapped/>
                                </div>
                                <div className="album-artist-info-name">{album.artists[0].name}</div>
                            </div>
                        </Link>
                        {album.artists.slice(1).map((artist) => (
                            <Link style = {{textDecoration:"none"}} to={`/artist/${artist?.id}`}>
                                <div className="album-artist-info">
                                    <div className="album-artist-avatar-wrapper">
                                        <Cover coverUri={artist.cover.uri} size="50x50" unWrapped/>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div onClick={()=>{setShowMenu(true)}}>
                    <MoreVert/>
                </div>
                </>
            }>
            </PageHeader>
            {album.volumes.map((volume)=>(
             <SongsList playlist={{kind:album.id,cover:{uri:album.coverUri},uid:0,ogImage:album.coverUri,available:true,owner:{uid:album.artists[0].id,name:album.artists[0].name,verified:true},title:album.title,description:"",tracks:trackArrayWrap(volume)}} tracks={trackArrayWrap(volume)}/>
            ))}
        </div>
         <PopUpModal active={showMenu} setActive={setShowMenu}>
            <MobileAlbumInfo album={album}/>
         </PopUpModal>
        </>
    )
}

export default Album