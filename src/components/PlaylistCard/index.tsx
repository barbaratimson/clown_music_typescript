import React from "react";
import { Link } from "react-router-dom";
import {PlaylistT} from "../../utils/types/types";
import {getImageLink} from "../../utils/utils";
import Cover from "../Cover";
import { ArrowForward } from "@mui/icons-material";

interface PlaylistCardProps {
    playlist: PlaylistT
    type: "line" | "block"
}

const PlaylistCard = ({playlist,type}:PlaylistCardProps) => {

    switch (type) {
        case "block": {
            return <PlaylistCardBlock playlist={playlist}/>
        }
        case "line": {
            return <PlaylistCardLine playlist={playlist}/>
        }
    }
  
}

const PlaylistCardBlock = ({playlist}:Omit<PlaylistCardProps,"type">) => {
    return (
        <>
        <Link style = {{textDecoration:"none",width:"fit-content"}} to={`/users/${playlist.owner.uid}/playlist/${playlist.kind}`}>
            <div key={playlist.kind} className="playlist-card-wrapper">
                <Cover coverUri={playlist.cover.uri} size="200x200" imageSize="400x400"/>
                <div className="playlist-card-title-wrapper">
                    <div className="playlist-card-title">{playlist.title}</div>
                </div>
            </div>
        </Link>
        </>
    )
}


const PlaylistCardLine = ({playlist}:Omit<PlaylistCardProps,"type">) => {
    return (
        <>
        <Link style = {{textDecoration:"none",width:"fit-content"}} to={`/users/${playlist.owner.uid}/playlist/${playlist.kind}`}>
            <div key={playlist.kind} className="playlist-card-line-wrapper">
                <Cover coverUri={playlist.cover.uri} size="75x75" imageSize="100x100"/>
                <div className="playlist-card-line-title-wrapper">
                    <div className="playlist-card-title">{playlist.title}</div>
                </div>
                <div className="playlist-card-line-icon"><ArrowForward fontSize="medium"/></div>
            </div>
        </Link>
        </>
    )
}

export default PlaylistCard