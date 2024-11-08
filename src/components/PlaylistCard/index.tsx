import React from "react";
import {Link} from "react-router-dom";
import Cover, {ImagePlaceholder} from "../Cover";
import {ArrowForwardIos} from "@mui/icons-material";
import ListIcon from '@mui/icons-material/List';

interface PlaylistCardProps {
    title: string,
    link?: string,
    coverUri: string
    type: "line" | "block",
}

const PlaylistCard = ({title,link,coverUri,type}:PlaylistCardProps) => {

    switch (type) {
        case "block": {
            return <PlaylistCardBlock title={title} link={link} coverUri={coverUri}/>
        }
        case "line": {
            return <PlaylistCardLine title={title} link={link} coverUri={coverUri}/>
        }
    }
  
}

const PlaylistCardBlock = ({title,link,coverUri}:Omit<PlaylistCardProps,"type">) => {
    return (
        <>
            {link ? (
                <Link style = {{textDecoration:"none",width:"fit-content"}} to={link}>
                    <div className="playlist-card-wrapper">
                        <Cover coverUri={coverUri} placeholder={<ImagePlaceholder children={<ListIcon fontSize="large"/>}/>} size="150x150" imageSize="300x300"/>
                        <div className="playlist-card-title-wrapper">
                            <div className="playlist-card-title">{title}</div>
                        </div>
                    </div>
                </Link>
            ): (
                <div className="playlist-card-wrapper">
                    <Cover coverUri={coverUri} placeholder={<ImagePlaceholder children={<ListIcon fontSize="large"/>}/>} size="150x150" imageSize="300x300"/>
                    <div className="playlist-card-title-wrapper">
                        <div className="playlist-card-title">{title}</div>
                    </div>
                </div>
            )}
        </>
    )
}


const PlaylistCardLine = ({title,link,coverUri}:Omit<PlaylistCardProps,"type">) => {
    return (
        <>
            {link ? (
                <Link style = {{textDecoration:"none",width:"auto"}} to={link}>
                    <div className="playlist-card-line-wrapper">
                        <Cover coverUri={coverUri} size="75x75" placeholder={<ImagePlaceholder children={<ListIcon fontSize="large"/>}/>} imageSize="200x200"/>
                        <div className="playlist-card-line-title-wrapper">
                            <div className="playlist-card-line-title">{title}</div>
                        </div>
                        <div className="playlist-card-line-icon"><ArrowForwardIos fontSize="medium"/></div>
                    </div>
                </Link>
            ): (
                <div className="playlist-card-line-wrapper">
                    <Cover coverUri={coverUri} size="75x75" placeholder={<ImagePlaceholder children={<ListIcon fontSize="large"/>}/>} imageSize="200x200"/>
                    <div className="playlist-card-line-title-wrapper">
                        <div className="playlist-card-line-title">{title}</div>
                    </div>
                    <div className="playlist-card-line-icon"><ArrowForwardIos fontSize="medium"/></div>
                </div>
            )}
        </>
    )
}

export default PlaylistCard