import React, {useEffect, useRef, useState} from 'react';
import {TrackT, TrackType} from "../../utils/types/types";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {Box, IconButton, LinearProgress} from "@mui/material";
import Slider from '@mui/material/Slider';
import {
    FastForwardRounded,
    FastRewindRounded,
    PauseRounded,
    PlayArrowRounded,
    Repeat,
    Shuffle, VolumeDown,
    VolumeMute, VolumeOff, VolumeUp
} from '@mui/icons-material';
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong, updateSongLink} from "../../store/CurrentSongSlice";
import {playerSeekTo, playerStart, playerStop, setIsLoading, setSrc} from "../../store/PlayerSlice";
import {getImageLink} from "../../utils/utils";
import {fetchYaSongLink} from '../../utils/apiRequests';

const Player = () => {
    const dispatch = useAppDispatch()
    const audioElem = useRef<HTMLAudioElement>(null)
    const [position, setPosition] = useState(0)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const [duration, setDuration] = useState(0)
    const [buffered, setBuffered] = useState<number | undefined>()
    const playerState = useAppSelector((state: RootState) => state.player)
    const [playerShuffle, setPlayerShuffle] = useState(false)
    const queue = useAppSelector((state: RootState) => state.playingQueue.queue)
    const [playerVolume, setPlayerVolume] = useState(50)
    const [playerRepeat, setPlayerRepeat] = useState(false)

    const volumeMultiplier = 0.5
    const changePlayerTime = (time: number) => dispatch(playerSeekTo(time))
    const setPlayerSrc = (link: string) => dispatch(setSrc(link))
    const setLoading = (loading: boolean) => dispatch(setIsLoading(loading))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const playerSeekToTime = useAppSelector((state: RootState) => state.player.currentTime)
    const setCurrentSong = (track: TrackType) => dispatch(changeCurrentSong(track))
    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()

            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
            console.log(playerState.playing)
        }
    }
    const onPlaying = (e: any) => {
        const duration = audioElem.current?.duration;
        const ct = audioElem.current?.currentTime;
        if (ct && duration) {
            setDuration(duration)
            setPosition(ct)
        }
        setBuffered(getBuffered())
    }

    const changeTime = (value: number) => {
        if (audioElem.current && audioElem.current.currentTime !== 0) {
            audioElem.current.currentTime = value
        }
    }
    const getBuffered = () => {
        if (audioElem.current && audioElem.current.duration > 0) {
            if (
                audioElem.current.buffered.start(audioElem.current.buffered.length - 1) < audioElem.current.currentTime
            ) {

                return (audioElem.current.buffered.end(audioElem.current.buffered.length - 1) / audioElem.current.duration) * 100
            }
        }
    }

    const skipBack = () => {
        const index = queue.tracks.findIndex(x => x.id == currentSong.id);
        if (!audioElem.current) return
        if (audioElem.current.currentTime >= 10) {
            audioElem.current.currentTime = 0
        } else if (index !== 0) {
            setCurrentSong(queue.tracks[index + -1])
        } else {
            changePlayerTime(0)
            console.log(playerSeekToTime)
        }
    }
    const skipForward = () => {
        const index = queue.tracks.findIndex(x => x.id == currentSong.id);
        if (!audioElem.current) return
        if (playerRepeat && audioElem.current.currentTime === audioElem.current.duration) {
            audioElem.current.currentTime = 0
            startPlayerFunc()
        } else if (playerShuffle) {
            let randomSong = () => (Math.random() * (queue.tracks.length + 1)) << 0
            let newSongId = randomSong()
            if (queue.tracks[newSongId] === currentSong) {
                setCurrentSong(queue.tracks[randomSong()])
            } else {
                setCurrentSong(queue.tracks[newSongId])
            }
        } else if (index === queue.tracks.length - 1) {
            setCurrentSong(queue.tracks[0])
        } else {
            setCurrentSong(queue.tracks[index + 1])
        }
    }

    function secToMinutesAndSeconds(time:number | undefined) {
        if (time){
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time - minutes * 60);
            return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds).toString();
        } else {
            return '-:-'
        }
    }

    useEffect(() => {
        if (!audioElem.current) {
            return
        }
        if (!playerState.playing) {
            audioElem.current.pause()
        } else {
            audioElem.current.play().catch((e) => {
            })
        }
    }, [playerState]);

    useEffect(() => {
        const changeTrack = async () => {
            setLoading(true)
            stopPlayerFunc()
            setPlayerSrc("")
            changePlayerTime(0)
            setPlayerSrc(await fetchYaSongLink(currentSong.id))
            startPlayerFunc()
        }
        changeTrack()
    }, [currentSong]);

    useEffect(() => {
        if (audioElem.current) {
            audioElem.current.currentTime = playerSeekToTime
        }
    }, [playerSeekToTime]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress)
    });

    useEffect(() => {
        if (audioElem.current) {
            audioElem.current.volume = (playerVolume * volumeMultiplier) / 100
        }
    }, [playerVolume]);

    return (
        <>
            <div className="player-wrapper">
                <div className="player-track-info-wrapper" key={currentSong.id}>
                    <div className="player-track-cover-wrapper">
                        <img src={getImageLink(currentSong.track.coverUri, "200x200")} loading="lazy" alt=""/>
                    </div>
                    <div className="player-track-info">
                        <div className="player-track-info-title">
                            {currentSong.track.title}
                        </div>
                        <div className="player-track-info-artists-wrapper">
                        {currentSong.track.artists.map(artist => (
                                <div className="player-track-info-artist">{artist.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="player-primary-controls">
                    <Box
                        className="player-primary-buttons-wrapper"
                    >
                        <div className={`player-primary-button shuffle ${playerShuffle ? "active" : ""}`}
                             onClick={() => {
                                 setPlayerShuffle(!playerShuffle)
                             }}><Shuffle/></div>
                        <IconButton onClick={skipBack} className="player-primary-button" aria-label="previous song">
                            <FastRewindRounded/>
                        </IconButton>
                        <IconButton
                            className="player-primary-button play"
                            aria-label={playerState.playing ? 'play' : 'pause'}
                            onClick={() => {
                                !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
                            }}
                            onKeyDown={(e) => {
                                e.preventDefault();
                                handleKeyPress(e)
                            }}
                        >
                            {!playerState.playing ? (
                                <PlayArrowRounded/>
                            ) : (
                                <PauseRounded/>
                            )}
                        </IconButton>
                        <IconButton onClick={skipForward} className="player-primary-button" aria-label="next song">
                            <FastForwardRounded/>
                        </IconButton>
                        <div className={`player-primary-button repeat ${playerRepeat ? "active" : ""}`}
                             onClick={() => {
                                 setPlayerRepeat(!playerRepeat)
                             }}><Repeat /></div>
                    </Box>
                    <div className="player-primary-seek-wrapper">

                        <div className="player-primary-trackTime">
                            {secToMinutesAndSeconds(audioElem.current ? audioElem.current.currentTime : undefined)}
                        </div>
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
                                valueLabelDisplay="auto"/>
                        ) : (
                            <LinearProgress className="player-loader" color="inherit"/>
                        )}
                        <div className="player-primary-trackTime">
                            {secToMinutesAndSeconds(audioElem.current ? audioElem.current.duration : undefined)}
                        </div>
                    </div>
                </div>
                <div className="player-secondary-controls">
                <div className="player-volume-wrapper">
                            {playerVolume === 0 ? (
                            <VolumeOff/>
                        ) : playerVolume <= 33 ? (
                            <VolumeMute/>
                        ) : playerVolume <= 66 ? (
                            <VolumeDown/>
                        ) : playerVolume <= 100 ? (
                            <VolumeUp/>
                        ) : null}
                        <Slider size="small"
                                value={playerVolume}
                                max={100}
                                step={1}
                                onChange={(_, value) => setPlayerVolume(value as number)}
                                className="player-seek"
                                sx={{
                                    color: '#fff',
                                    height: 4,
                                    '& .MuiSlider-track': {
                                        border: 'none',
                                    },
                                    '& .MuiSlider-thumb': {
                                        '&::before': {
                                            boxShadow: 'none',
                                        },
                                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                            boxShadow: 'none',
                                        },
                                }}}
                                aria-label="Default" valueLabelDisplay="auto"/>
                    </div>
                </div>
            </div>
            <audio preload={"auto"} crossOrigin="anonymous"
                   src={playerState.src} ref={audioElem}
                   onLoadStart={() => {
                       setLoading(true)
                   }}
                   onError={(e) => {
                       stopPlayerFunc()
                       setLoading(false)
                   }}
                   onCanPlay={() => {
                       setLoading(false)
                   }} onPlay={() => {
                startPlayerFunc()
            }}
                   onPause={() => {
                       stopPlayerFunc()
                   }} onEnded={(e) => {
                skipForward()
            }} onTimeUpdate={onPlaying}></audio>
        </>
    )
}

export default Player;


