import React, {useEffect, useRef, useState} from 'react';
import {QueueT, TrackDefaultT, TrackId, TrackT, TrackType} from "../../utils/types/types";
import {Box, IconButton, LinearProgress} from "@mui/material";
import Slider from '@mui/material/Slider';
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop, setIsLoading, setRepeat, setShuffle, setSrc} from "../../store/PlayerSlice";
import {getImageLink, secToMinutesAndSeconds} from "../../utils/utils";
import {dislikeSong, fetchLikedSongs, fetchYaSongLink, likeSong} from '../../utils/apiRequests';
import ArtistName from '../ArtistName';
import {
    FastForwardRounded,
    FastRewindRounded,
    Favorite,
    FavoriteBorder,
    PauseRounded,
    PlayArrowRounded,
    Repeat,
    Shuffle,
    VolumeDown,
    VolumeMute,
    VolumeOff,
    VolumeUp
} from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import {showMessage} from '../../store/MessageSlice';
import {setLikedSongs} from '../../store/LikedSongsSlice';
import {addTrackToQueue, setOpeningState, setQueue} from "../../store/playingQueueSlice";
import { trackArrayWrap, trackWrap } from '../../utils/trackWrap';


const savedVolume = localStorage.getItem("player_volume")
const Player = () => {
    const dispatch = useAppDispatch()
    const audioElem = useRef<HTMLAudioElement>(null)
    const [position, setPosition] = useState(0)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const [duration, setDuration] = useState(0)
    const [buffered, setBuffered] = useState<number | undefined>()
    const playerState = useAppSelector((state: RootState) => state.player)
    const queue = useAppSelector((state: RootState) => state.playingQueue.queue.queueTracks)
    const queueCurrentPlaylist = useAppSelector((state: RootState) => state.playingQueue.queue.playlist)
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    const [playerVolume, setPlayerVolume    ] = useState<number>(Number(savedVolume)?? 50)
    const [queueButton, setQueueButton] = useState<any>()
    const [liked,setLiked] = useState(true)
    const likedSongs = useAppSelector((state:RootState) => state.likedSongs.likedSongs)
    const setPlayerShuffle = (shuffle: boolean) => dispatch(setShuffle(shuffle))
    const setPlayerRepeat = (repeat: boolean) => dispatch(setRepeat(repeat))
    const volumeMultiplier = 0.25
    const trackAddedMessage = (message:string) => dispatch(showMessage({message:message}))
    const setLikedSongsData = (songs:Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setQueueOpen = (open:boolean) => dispatch(setOpeningState(open))
    const setPlayerSrc = (link: string) => dispatch(setSrc(link))
    const setLoading = (loading: boolean) => dispatch(setIsLoading(loading))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))

    const setPlayingQueue = (queue: Array<TrackDefaultT>) => dispatch(setQueue(queue))
    const addToQueue = (track: TrackType) => dispatch(addTrackToQueue(track))

    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()

            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
        }
    }

    const isLiked = (id: number | string) => {
        const likedSong = likedSongs?.find((song) => String(song.id) === String(id))
        return !!likedSong
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

        navigator.mediaSession.setActionHandler("play", (e) => {
            startPlayerFunc()
        })
          
        navigator.mediaSession.setActionHandler("pause", (e) => {
            stopPlayerFunc()
        })

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
        const index = queue.findIndex(x => x.track.id == currentSong.id);
        if (!audioElem.current) return
        if (audioElem.current.currentTime >= 10) {
            audioElem.current.currentTime = 0
        } else if (index !== 0) {
            setCurrentSong(queue[index -1].track)
        } else {
            changeTime(0)
        }
    }

    const skipForward = () => {
        const index = queue.findIndex(x => x.track.id == currentSong.id);
        if (!audioElem.current) return
        if (playerState.repeat && audioElem.current.currentTime === audioElem.current.duration) {
            audioElem.current.currentTime = 0
            startPlayerFunc()
        } else if (index === queue.length - 1) {
            if (playerState.shuffle) {
                setPlayingQueue([trackWrap(currentSong), randomSongFromTrackList(queueCurrentPlaylist.tracks)])
            } else {
                setCurrentSong(queue[0].track)
            }
        } else {
            setCurrentSong(queue[index + 1].track)
        }
    }


    const randomSongFromTrackList = (trackList:Array<TrackType>) => {
        return trackList[Math.floor((Math.random()*trackList.length))]
    }

    const updateLikedSongs = async (action:"liked" | "removed") => {
        setLikedSongsData( await fetchLikedSongs())
        if (action === "liked") trackAddedMessage(`Track ${currentSong.title} added to Liked`);
        if (action === "removed") trackAddedMessage(`Track ${currentSong.title} removed to Liked`);
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
        if (!currentSong.available) skipForward()
        const changeTrack = async () => {
            if (currentSong.available && currentSong){
                stopPlayerFunc()
                setPlayerSrc(await fetchYaSongLink(currentSong.id))
            }
        }
         changeTrack()

        if (queue.length !== 0 && currentSong.id !== 0) {
            const index = queue.findIndex(x => x.id == currentSong.id);
            if (playerState.shuffle && index === queue.length-1 && queue.length !== queueCurrentPlaylist.tracks.length) {
                let newSong:TrackType;
                do {
                    newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
                } while (queue.findIndex(x => x.track.id === newSong.track.id) !== -1)
                addToQueue(newSong)
            }
        }

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
        localStorage.setItem("player_repeat", playerState.repeat.toString())
    }, [playerState.repeat]);

    useEffect(() => {
        localStorage.setItem("player_shuffle", playerState.shuffle.toString())

        if (playerState.shuffle) {
            setPlayingQueue([trackWrap(currentSong),randomSongFromTrackList(queueCurrentPlaylist.tracks)])
        } else {
            setPlayingQueue(queueCurrentPlaylist.tracks)
        }
    }, [playerState.shuffle]);


    



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
                            <span className="track-info-artist-span">
                        {currentSong.artists.map(artist => (
                           <ArtistName size={"15px"} artist={artist}/>
                            ))}
                            </span>
                        </div>
                    </div>
                    <div className="player-track-controls">
                        <div className="player-track-controls-border">
                            {isLiked(currentSong.id) ? (
                                <div className={`player-track-controls-likeButton ${isLiked(currentSong.id) ? "heart-pulse" : null}`} onClick={()=>{dislikeSong(currentSong).then((response) => updateLikedSongs("removed"))}}>
                                    <Favorite/>
                                </div>
                            ) : (
                                <div className={`player-track-controls-likeButton`} onClick={()=>{likeSong(currentSong).then((response) => updateLikedSongs("liked"))}}>
                                    <FavoriteBorder/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="player-primary-controls">
                <Box
                        className="player-primary-buttons-wrapper"
                    >
                        <div className={`player-primary-button shuffle ${playerState.shuffle ? "active" : ""}`}
                             ><Shuffle onClick={() => {
                            setPlayerShuffle(!playerState.shuffle)
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
                        <div className={`player-primary-button repeat ${playerState.repeat ? "active" : ""}`}
                             ><Repeat onClick={() => {
                            setPlayerRepeat(!playerState.repeat)
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
                    <div className="player-button-row">
                        <div className="player-queue-button" onClick={(e)=>{setQueueOpen(!queueOpen);setQueueButton(e.currentTarget.getBoundingClientRect())}}><ListIcon/></div>
                    </div>
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


