import React, {useRef, useState} from "react";
import {AlbumT, PlaylistT} from "../../../../utils/types/types";
import SongsList from "../../../SongsList";
import {useAppDispatch} from "../../../../store";
import {trackArrayWrap} from "../../../../utils/trackWrap";
import {Link, useNavigate} from "react-router-dom";
import PageHeader from "../../../UI/PageHeader";
import Cover from "../../../UI/Cover";
import {MoreVert} from "@mui/icons-material";
import PopUpModal from "../../../UI/PopUpModal";
import {setPlaylistInfo} from "../../../../store/playlistInfoSlice";
import playlist from "../../PlaylistView/Playlist";
import MobileAlbumInfo from "../../../MobileAlbumInfo";
import Loader from "../../../UI/Loader";
import Button from "../../../UI/Button/Button";
import track from "../../../Track";
import {getCMImageUrl} from "../../../../utils/cmApiRequsts";

interface AlbumProps {
    album: AlbumT
}


const Album = ({album}: AlbumProps) => {
    const dispatch = useAppDispatch()
    const playlistInfo = useRef(null)
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    return (
        <>
        <div className="playlist-wrapper animated-opacity">
            <PageHeader ref={playlistInfo} titleText={album.title} src={album.cover.id} controls={
                <>
                <div style={{flexGrow:"1"}}>
                    <div className="album-artist-info-wrapper">
                        {album.artists.slice(1).map((artist) => (
                            <Button onClick={()=>{navigate(`/artist/${artist.id}`)}}>
                                    <Cover className="album-artist-avatar-wrapper" src={getCMImageUrl(artist.cover.id,"50x50")} unWrapped size="50x50"/>
                            </Button>
                        ))}
                        <Button onClick={()=>{navigate(`/artist/${album.artists[0].id}`)}}>
                            <div className="album-artist-info">
                                    <Cover className="album-artist-avatar-wrapper" src={getCMImageUrl(album.artists[0].cover.id,"50x50")} unWrapped size="50x50"/>
                                <div className="album-artist-info-name">{album.artists[0].name}</div>
                            </div>
                        </Button>
                    </div>
                </div>
                <div onClick={()=>{setShowMenu(true)}}>
                    <MoreVert/>
                </div>
                </>
            }>
            </PageHeader>
             <SongsList playlist={album as unknown as PlaylistT} tracks={album.tracks}/>
        </div>
         <PopUpModal active={showMenu} setActive={setShowMenu}>
            <MobileAlbumInfo album={album}/>
         </PopUpModal>
        </>
    )
}

export default Album