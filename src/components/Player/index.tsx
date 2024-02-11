import React, {useEffect, useRef, useState} from 'react';
import {SongT} from "../../utils/types/types";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {Box, IconButton} from "@mui/material";
import Slider from '@mui/material/Slider';
import {FastForwardRounded, FastRewindRounded, PauseRounded, PlayArrowRounded} from '@mui/icons-material';

interface PlayerProps {
    playerState: "loading" | "playing" | "error",
    playPause: Function
    currentSong: SongT

}

const Player = () => {
    const audioElem = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [position, setPosition] = useState(0)
    const currentSong = {url:"https://s286myt.storage.yandex.net/get-mp3/43979d3e67f599eae0e59a6e54be731f/000611183ad7a768/rmusic/U2FsdGVkX19zEcMjhrDcEUawGULWR98kCY-s5BNDLZ2HoInsNbQVcC3r_20TY8Xyrln6g8HB8X36gtVZ2CswG6LdpTra-nYh5DIMLOEexm4/40c62d6787ae0140d4ac2a43595bf7e366f9a65dfdb7cc552c5119f281b7027e"}
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
    });
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


