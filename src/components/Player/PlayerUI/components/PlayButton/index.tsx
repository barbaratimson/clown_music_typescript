import {IconButton} from "@mui/material";
import {PauseRounded, PlayArrowRounded} from "@mui/icons-material";

interface PlayButtonProps {
    playing: boolean,
    startFunc: Function,
    stopFunc: Function,
    onKeyDown: Function
    className?: string
}

const PlayButton = ({playing,startFunc,stopFunc,onKeyDown,className}:PlayButtonProps)=>{
    return (
        <>
            <IconButton
                className={`player-primary-button play ${className}`}
                key={`player-button-play-${playing}`}
                aria-label={playing ? 'play' : 'pause'}
                onClick={() => {
                    !playing ? startFunc() : stopFunc()
                }}
                onKeyDown={(e) => {
                   onKeyDown(e)
                }}
            >
                {!playing ? (
                    <PlayArrowRounded />
                ) : (
                    <PauseRounded />
                )}
            </IconButton>            
        </>
    )
}

export default PlayButton
