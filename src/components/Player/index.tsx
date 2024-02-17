import React, {useEffect, useRef, useState} from 'react';
import {TrackT} from "../../utils/types/types";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {Box, IconButton} from "@mui/material";
import Slider from '@mui/material/Slider';
import {FastForwardRounded, FastRewindRounded, PauseRounded, PlayArrowRounded} from '@mui/icons-material';

interface PlayerProps {
    playerState: "loading" | "playing" | "error",
    playPause: Function
    currentSong: TrackT

}

const Player = () => {
    const audioElem = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [position, setPosition] = useState(0)
    const currentSong = {url:"https://s200iva.storage.yandex.net/get-mp3/bbdb0d554a46b57693640705aff25814/000611846b080229/rmusic/U2FsdGVkX1_LcCjGiSov9LnyCqtN3DhAtjVOzgMEkaWHaRPJ52rpmLI9m4sRZLgkjcGjveY8HljFvhDk51ke_3QBkjCb0xHX6n_rV7CWzRY/bf446e78933de14fc051ed19eeb2f0e87273baa9f874b75d02a4b3f972aaff58"}
    const [songLoading, setIsSongLoading] = useState(false)
    const [duration,setDuration] = useState(0)
    const [buffered, setBuffered] = useState<number | undefined>()
    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()
            !isPlaying ? audioElem.current?.play() : audioElem.current?.pause()
        }
    }
    const onPlaying = (e:any) => {
        const duration = audioElem.current?.duration;
        const ct = audioElem.current?.currentTime;
        if (ct && duration){
            setDuration(duration)
            setPosition(ct)
        }
        setBuffered(getBuffered())
    }
    const changeTime = (value:number) => {
        if (audioElem.current && audioElem.current.currentTime !== 0) {
            audioElem.current.currentTime=value
        }
    }
    const getBuffered = () => {
        if (audioElem.current && audioElem.current.duration > 0) {
            if (
                audioElem.current.buffered.start(audioElem.current.buffered.length - 1) < audioElem.current.currentTime
            ) {

                return (audioElem.current.buffered.end(audioElem.current.buffered.length-1)/audioElem.current.duration)*100
            }
        }
    }



    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress)
    },[]);
    useEffect(() => {
        if (audioElem.current) {
            audioElem.current.volume = 0.05
        }
    }, []);
    return (
        <>
            <div className="player-wrapper">
                <div className="player-track-info">

                </div>
                <div className="player-primary-controls">
                    <Box
                        className="player-primary-buttons-wrapper"
                    >
                        <IconButton className="player-primary-button" aria-label="previous song">
                            <FastRewindRounded/>
                        </IconButton>
                        <IconButton
                            className="player-primary-button play"
                            aria-label={isPlaying ? 'play' : 'pause'}
                            onClick={()=>{!isPlaying ? audioElem.current?.play() : audioElem.current?.pause()}}
                            onKeyDown={(e)=>{e.preventDefault();handleKeyPress(e)}}
                        >
                            {!isPlaying ? (
                                <PlayArrowRounded/>
                            ) : (
                                <PauseRounded/>
                            )}
                        </IconButton>
                        <IconButton className="player-primary-button" aria-label="next song">
                            <FastForwardRounded/>
                        </IconButton>
                    </Box>
                    <Slider
                        aria-label="time-indicator"
                        size="small"
                        value={position}
                        min={0}
                        step={1}
                        max={duration}
                        onChange={(_, value) => changeTime(value as number)}
                        sx={{
                            color: '#fff',
                            height: 4,
                            '& .MuiSlider-thumb': {
                                display: "none",
                            },
                            '& .MuiSlider-rail': {
                                opacity: 0.28,
                            },
                        }}
                    />
                </div>
                <div className="player-secondary-controls">

                </div>
            </div>
            <audio preload={"auto"} crossOrigin="anonymous"
                   src={currentSong.url} ref={audioElem}
                   onLoadStart={() => {
                       setIsSongLoading(true)
                   }}
                   onError={(e) => {
                       setIsPlaying(false);
                       setIsSongLoading(false)
                   }}
                   onCanPlay={() => {
                       setIsSongLoading(false)
                   }} onPlay={() => {
                setIsPlaying(true)
            }}
                   onPause={() => {
                       setIsPlaying(false)
                   }} onEnded={(e) => {
                // skiptoNext(e)
            }} onTimeUpdate={onPlaying}></audio>
        </>
    )
}

export default Player;


