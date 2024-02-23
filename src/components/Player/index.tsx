import React, {useEffect, useRef, useState} from 'react';
import {TrackT} from "../../utils/types/types";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {Box, IconButton, LinearProgress} from "@mui/material";
import Slider from '@mui/material/Slider';
import {FastForwardRounded, FastRewindRounded, PauseRounded, PlayArrowRounded} from '@mui/icons-material';
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import axios from "axios";
import {updateSongLink} from "../../store/CurrentSongSlice";
import {playerStart, playerStop, setIsLoading} from "../../store/PlayerSlice";
import {getImageLink} from "../../utils/utils";

interface PlayerProps {
    playerState: "loading" | "playing" | "error",
    playPause: Function
    currentSong: TrackT

}

const link = process.env.REACT_APP_YMAPI_LINK

const Player = () => {
    const dispatch = useAppDispatch()
    const audioElem = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [position, setPosition] = useState(0)
    const currentSong = useAppSelector((state:RootState) => state.CurrentSongStore.currentSong)
    const [duration,setDuration] = useState(0)
    const [buffered, setBuffered] = useState<number | undefined>()
    const playerState = useAppSelector((state:RootState)=>state.player)
    const setLoading = (loading:boolean) => dispatch(setIsLoading(loading))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const playerSeekTo = useAppSelector((state:RootState) => state.player.currentTime )
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
        if (!audioElem.current) {
            return
        }
        if (!playerState.playing){
            audioElem.current.pause()
        } else {
             audioElem.current.play().catch((e)=>{
                 console.warn(e)
             })
        }
        }, [playerState]);

    useEffect(() => {
       if (audioElem.current) {
           audioElem.current.currentTime = playerSeekTo
       }
    }, [playerSeekTo]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress)
    },[]);
    useEffect(() => {
        if (audioElem.current) {
            audioElem.current.volume = 0.1
        }
    }, []);
    return (
        <>
            <div className="player-wrapper">
                <div className="player-track-info-wrapper" key={currentSong.id}>
                    <div className="player-track-cover-wrapper">
                        <img src={getImageLink(currentSong.coverUri, "200x200")} loading="lazy" alt=""/>
                    </div>
                    <div className="player-track-info">
                        <div className="player-track-info-title">
                            {currentSong.title}
                        </div>
                        <div className="player-track-info-artists-wrapper">
                            {currentSong.artists.map(artist => (
                                <div className="player-track-info-artist">{artist.name}</div>
                            ))}
                        </div>
                    </div>
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
                            aria-label={playerState.playing ? 'play' : 'pause'}
                            onClick={()=>{!playerState.playing ? startPlayerFunc() : stopPlayerFunc()}}
                            onKeyDown={(e)=>{e.preventDefault();handleKeyPress(e)}}
                        >
                            {!playerState.playing ? (
                                <PlayArrowRounded/>
                            ) : (
                                <PauseRounded/>
                            )}
                        </IconButton>
                        <IconButton className="player-primary-button" aria-label="next song">
                            <FastForwardRounded/>
                        </IconButton>
                    </Box>
                    {!playerState.loading ? (
                        <Slider
                            aria-label="time-indicator"
                            size="small"
                            value={position}
                            min={0}
                            step={1}
                            max={duration}
                            onChange={(_, value) => changeTime(value as number)}
                            className="player-seek"
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
                    ) : (
                        <LinearProgress color="inherit" />
                    )}

                </div>
                <div className="player-secondary-controls">

                </div>
            </div>
            <audio preload={"auto"} crossOrigin="anonymous"
                   src={playerState.src} ref={audioElem}
                   onLoadStart={() => {
                       setLoading(true)
                   }}
                   onError={(e) => {
                       setIsPlaying(false);
                       setLoading(false)
                   }}
                   onCanPlay={() => {
                       setLoading(false)
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


