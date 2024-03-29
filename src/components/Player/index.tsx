import React, {useEffect, useRef, useState} from 'react';
import {TrackT, TrackType} from "../../utils/types/types";
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
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop, setIsLoading, setSrc} from "../../store/PlayerSlice";
import {getImageLink} from "../../utils/utils";
import {fetchYaSongLink} from '../../utils/apiRequests';
import {Link} from "react-router-dom";


const savedVolume = localStorage.getItem("player_volume")
const savedRepeat = localStorage.getItem("player_repeat")
const savedShuffle = localStorage.getItem("player_shuffle")
const Player = () => {
    const dispatch = useAppDispatch()
    const audioElem = useRef<HTMLAudioElement>(null)
    const [position, setPosition] = useState(0)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const [duration, setDuration] = useState(0)
    const [buffered, setBuffered] = useState<number | undefined>()
    const playerState = useAppSelector((state: RootState) => state.player)
    const [playerShuffle, setPlayerShuffle] = useState<boolean>(savedShuffle === "true")
    const queue = useAppSelector((state: RootState) => state.playingQueue.queue)
    const [playerVolume, setPlayerVolume    ] = useState<number>(Number(savedVolume)?? 50)
    const [playerRepeat, setPlayerRepeat] = useState<boolean>(savedRepeat === "true")

    const volumeMultiplier = 0.5
    const setPlayerSrc = (link: string) => dispatch(setSrc(link))
    const setLoading = (loading: boolean) => dispatch(setIsLoading(loading))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))
    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()

            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
        }
    }

    const setMediaSession = (track:TrackT) => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artists && track.artists.length > 0 ? track.artists[0].name : "",
            artwork: [
                {
                    src: getImageLink(track.coverUri, "200x200") ?? "",
                    sizes: "512x512",
                    type: "image/png",
                },
            ]
        })

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            skipBack()
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            skipForward()
        });

        navigator.mediaSession.setActionHandler("seekto", (e) => {
            if (e.seekTime && audioElem.current) {
                audioElem.current.currentTime = e.seekTime
            }
        });
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
            setCurrentSong(queue.tracks[index + -1].track)
        } else {
            changeTime(0)
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
            if (queue.tracks[newSongId].track === currentSong) {
                setCurrentSong(queue.tracks[randomSong()].track)
            } else {
                setCurrentSong(queue.tracks[newSongId].track)
            }
        } else if (index === queue.tracks.length - 1) {
            setCurrentSong(queue.tracks[0].track)
        } else {
            setCurrentSong(queue.tracks[index + 1].track)
        }
    }

    function secToMinutesAndSeconds(time:number | undefined) {
        if (time){
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time - minutes * 60);
            return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds).toString();
        } else {
            return '0:00'
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

        setPosition(0)
        const changeTrack = async () => {
            setLoading(true)
            stopPlayerFunc()
            setPlayerSrc("")
            setPlayerSrc(await fetchYaSongLink(currentSong.id))
        }
        changeTrack()
    }, [currentSong]);

    useEffect(() => {
        setMediaSession(currentSong)
        return () => {
            navigator.mediaSession.metadata = null
        }
    }, []);

    useEffect(() => {
        setMediaSession(currentSong)
    }, [currentSong]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress)
    });




    useEffect(() => {
        if (audioElem.current) {
            audioElem.current.volume = (playerVolume * volumeMultiplier) / 100
        }
        localStorage.setItem("player_volume",playerVolume.toString())
    }, [playerVolume]);

    useEffect(() => {
        localStorage.setItem("player_repeat", playerRepeat.toString())
    }, [playerRepeat]);

    useEffect(() => {
        localStorage.setItem("player_shuffle", playerShuffle.toString())
    }, [playerShuffle]);

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
                                <Link style = {{textDecoration:"none"}} to={`/artist/${artist.id}`}> <div className="player-track-info-artist">{artist.name}</div></Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="player-primary-controls">
                    <Box
                        className="player-primary-buttons-wrapper"
                    >
                        <div className={`player-primary-button shuffle ${playerShuffle ? "active" : ""}`}
                             ><Shuffle onClick={() => {
                            setPlayerShuffle(!playerShuffle)
                        }}/></div>
                        <IconButton onClick={skipBack} className="player-primary-button" aria-label="previous song">
                            <FastRewindRounded/>
                        </IconButton>
                        <IconButton
                            className="player-primary-button play"
                            key={`player-button-play-${playerState.playing}`}
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
                             ><Repeat onClick={() => {
                            setPlayerRepeat(!playerRepeat)
                        }}/></div>
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
                       startPlayerFunc()
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


