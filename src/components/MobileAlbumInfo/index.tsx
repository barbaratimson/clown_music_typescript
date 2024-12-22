import React, {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import {RootState, useAppSelector} from "../../store";
import {Delete, KeyboardArrowDown} from "@mui/icons-material";
import Cover, {ImagePlaceholder} from "../UI/Cover";
import "./style.scss"
import {AlbumT} from "../../utils/types/types";

interface AlbumInfoT {
    album: AlbumT
}

const MobileAlbumInfo = ({album}: AlbumInfoT) => {
    const [params, setParams] = useSearchParams("")
    const playlistInfoState = useAppSelector((state: RootState) => state.playlistInfo)
    const [filterMenuActive, setFilterMenuActive] = useState(false)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [genresToFilter, setGenresToFilter] = useState<string[]>([])
    const currentUser = useAppSelector((state: RootState) => state.user)

    return (
        <>
            {album ? (
                <>
                    <div className="track-info-mobile-about-wrapper animated-opacity-4ms">
                        <>
                            <Cover placeholder={<ImagePlaceholder size="medium"/>} coverUri={album.coverUri}
                                   size="75x75" imageSize="200x200"/>
                            <div className="track-info-wrapper">
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                }} className="track-info-title mobile">{album.title}</div>
                                <div style={{marginTop: "5px"}}
                                     className="track-info-artist">{album.volumes[0].length + " tracks"}</div>
                            </div>
                            <div className="track-info-back-button">
                                <KeyboardArrowDown className="track-info-back-icon"/>
                            </div>
                        </>
                    </div>
                    <div className="track-info-mobile-controls-wrapper animated-opacity-4ms" onClick={(e) => {
                        e.stopPropagation()
                    }}>
                        <div className="track-info-mobile-control-button">
                            <div className="track-info-mobile-control-icon">
                                <Delete/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                {album.artists[0].name}
                            </div>
                        </div>
                        <div className="track-info-mobile-control-button">
                            <div className="track-info-mobile-control-icon">
                                <Delete/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                {album.genre}
                            </div>
                        </div>
                        <div className="track-info-mobile-control-button">
                            <div className="track-info-mobile-control-icon">
                                <Delete/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                {album.year}
                            </div>
                        </div>
                        <div className="track-info-mobile-control-button">
                            <div className="track-info-mobile-control-icon">
                                <Delete/>
                            </div>
                            <div className="track-info-mobile-control-label">
                                {album.likesCount}
                            </div>
                        </div>
                    </div>
                </>
            ) : null
            }
        </>
    )
}

export default MobileAlbumInfo
