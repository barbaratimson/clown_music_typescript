import React, { useEffect, useRef, useState } from 'react';
import { TrackDefaultT, TrackId, TrackT, TrackType } from "../../../utils/types/types";
import { Box, Fade, IconButton, LinearProgress, Skeleton, Slide } from "@mui/material";
import Slider from '@mui/material/Slider';
import { RootState, useAppDispatch, useAppSelector } from "../../../store";
import { changeCurrentSong } from "../../../store/CurrentSongSlice";
import {
    playerStart,
    playerStop,
    setIsLoading,
    setRepeat,
    setShuffle,
    setSrc
} from "../../../store/PlayerSlice";
import { addAlpha, getImageLink, secToMinutesAndSeconds } from "../../../utils/utils";
import { dislikeSong, fetchLikedSongs, fetchYaSongLink, likeSong } from '../../../utils/apiRequests';
import ArtistName from '../../ArtistName';
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
    VolumeUp,
    KeyboardArrowDown,
    ArrowBackIosNew,
    ExpandMore, ExpandLess, MoreVert,
    MusicNote
} from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import { MessageType, showMessage } from '../../../store/MessageSlice';
import { setLikedSongs } from '../../../store/LikedSongsSlice';
import { addTrackToQueue, setOpeningState, setQueue } from "../../../store/playingQueueSlice";
import { trackWrap } from '../../../utils/trackWrap';
import { setActiveState, setTrackInfo } from "../../../store/trackInfoSlice";
import { usePalette } from 'react-palette';
import { useLocation } from 'react-router-dom'
import SeekSlider from '../components/SeekSlider';
import PlayButton from '../components/PlayButton';
import QueueMobile from "../../Queue/QueueMobile";
import track from "../../Track/Track";
import { match } from 'assert';
import TrackCover, { ImagePlaceholder } from '../../TrackCover';
import { logMessage } from '../../../store/devLogSlice';


const savedVolume = localStorage.getItem("player_volume")
const emptySound = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAAA8TEFNRTMuOThyBK8AAAAAAAAAADQgJAawTQABzAAAAnGGK6g3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQRAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAETEFNRTMuOTguMlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBkIg/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ=="
const Player = () => {
    const location = useLocation()
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
    const [liked, setLiked] = useState(true)
    const likedSongs = useAppSelector((state: RootState) => state.likedSongs.likedSongs)
    const [playerFolded, setPlayerFolded] = useState(true)
    const setPlayerShuffle = (shuffle: boolean) => dispatch(setShuffle(shuffle))
    const setPlayerRepeat = (repeat: boolean) => dispatch(setRepeat(repeat))
    const volumeMultiplier = 1
    const mobilePlayerInitialVolume = process.env.REACT_APP_MOBILE_PLAYER_VOLUME ?? '1'
    const setTrackInfoState = (track: TrackT) => dispatch(setTrackInfo(track))
    const setTrackInfoShowState = (active: boolean) => dispatch(setActiveState(active))
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setTrackLikedMessage = (message: string, track: TrackT, type: MessageType) => dispatch(showMessage({ message: message, track: track, type: type }))
    const setQueueOpen = (open: boolean) => dispatch(setOpeningState(open))
    const setPlayerSrc = (link: string) => dispatch(setSrc(link))
    const setLoading = (loading: boolean) => dispatch(setIsLoading(loading))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))
    const mobilePlayerFull = useRef<HTMLDivElement>(null)
    const setPlayingQueue = (queue: Array<TrackDefaultT>) => dispatch(setQueue(queue))
    const addToQueue = (track: TrackType) => dispatch(addTrackToQueue(track))
    const devLog = (message: string) => dispatch(logMessage(message))
    const { data, loading, error } = usePalette(currentSong && currentSong.coverUri ? `http://${currentSong.coverUri.substring(0, currentSong.coverUri.lastIndexOf('/'))}/800x800` : "")
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

    const setMediaSession = (track: TrackT) => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artists && track.artists.length > 0 ? track.artists[0].name : "",
            artwork: [
                {
                    src: getImageLink(track.coverUri, "600x600") ?? "",
                    sizes: "512x512",
                    type: "image/png",
                },
            ]
        })

        navigator.mediaSession.setActionHandler("previoustrack", skipBack);
        navigator.mediaSession.setActionHandler("nexttrack", skipForward);

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
            if (Math.trunc(ct) !== Math.trunc(position)) {
                setPosition(ct)
            }
        }
        // setBuffered(getBuffered())
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
            setCurrentSong(queue[index - 1].track)
        } else {
            changeTime(0)
        }
    }

    const skipForward = () => {
        const index = queue.findIndex(x => x.track.id == currentSong.id);
        if (!audioElem.current) return
        if (playerState.repeat && audioElem.current.currentTime === audioElem.current.duration) {
            audioElem.current.currentTime = 0
            audioElem.current.play()
        } else if (index === queue.length - 1) {
            if (playerState.shuffle && queueCurrentPlaylist.tracks.length !== 1) {
                let newSong: TrackType;
                do {
                    newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
                } while (currentSong.id == newSong.track.id)
                setPlayingQueue([trackWrap(currentSong), newSong])
            } else {
                setCurrentSong(queue[0].track)
            }
        } else {
            setCurrentSong(queue[index + 1].track)
        }
    }
    const randomSongFromTrackList = (trackList: Array<TrackType>) => {
        return trackList[Math.floor((Math.random() * trackList.length))]
    }

    const updateLikedSongs = async (action: "liked" | "removed") => {
        setLikedSongsData(await fetchLikedSongs())
        if (action === "liked") setTrackLikedMessage(`Track ${currentSong.title} added to Liked`, currentSong, "trackLiked");
        if (action === "removed") setTrackLikedMessage(`Track ${currentSong.title} removed to Liked`, currentSong, "trackDisliked");
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
        const fetchAudioAndPlay = () => {
                devLog(`start fetching song link`)
                fetchYaSongLink(currentSong.id)
                .then(link => {
                    devLog(`song link ready ${link}`)
                    if (!audioElem.current) return
                    audioElem.current.src = link;
                    return audioElem.current.play();
                })
                .catch(e => {
                    console.log(e)
                    devLog(`error while fetching link: ${e.name && JSON.stringify(e)}`)
                })
        }
        devLog(`current song changed: ${currentSong.id} ${currentSong.title}`)
        setIsLoading(true)
        if (currentSong.available && currentSong && audioElem.current) {
            audioElem.current.volume = parseFloat(mobilePlayerInitialVolume)
            changeTime(0)
            setPosition(0)
        }

        fetchAudioAndPlay()


        if (queue.length !== 0 && currentSong.id !== 0) {
            const index = queue.findIndex(x => x.id == currentSong.id);
            if (playerState.shuffle && index === queue.length - 1 && queue.length !== queueCurrentPlaylist.tracks.length) {
                let newSong: TrackType;
                do {
                    newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
                } while (queue.findIndex(x => x.track.id === newSong.track.id) !== -1)
                addToQueue(newSong)
            }
        }
    }, [currentSong]);

    useEffect(() => {
        if (audioElem.current) {
            navigator.mediaSession.setPositionState({
                duration: duration,
                position: audioElem.current.currentTime,
            })
        }
    }, [position])

    useEffect(() => {
        if (!playerFolded) {
            document.body.style.overflow = "hidden"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [playerFolded]);

    useEffect(() => {
        setMediaSession(currentSong)
    }, []);

    useEffect(() => {
        setMediaSession(currentSong)
    }, [currentSong, queue]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress)
    });

    useEffect(() => {
        localStorage.setItem("player_repeat", playerState.repeat.toString())
    }, [playerState.repeat]);

    useEffect(() => {
        localStorage.setItem("player_shuffle", playerState.shuffle.toString())
        if (playerState.shuffle && queueCurrentPlaylist.tracks.length > 1) {
            let newSong: TrackType;
            do {
                newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
            } while (currentSong.id == newSong.track.id)
            setPlayingQueue([trackWrap(currentSong), newSong])
        } else {
            setPlayingQueue(queueCurrentPlaylist.tracks)
        }
    }, [playerState.shuffle]);

    useEffect(() => {
        if (!mobilePlayerFull.current || loading) return
        if (data.darkMuted) {
            mobilePlayerFull.current.style.backgroundColor = addAlpha(data.darkMuted, 0.7)
        } else {
            mobilePlayerFull.current.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
        }
    }, [data])

    useEffect(() => {
        setPlayerFolded(true)
    }, [location])

    return (
        <>
            {playerFolded &&
                <div className="player-wrapper" onClick={() => { setPlayerFolded(!playerFolded) }} style={{ marginBottom: "49px", gap: "0" }}>
                    <div className="player-track-info-wrapper mobile" key={currentSong.id}>      
                            <TrackCover placeholder={<ImagePlaceholder size="medium" />} coverUri={currentSong.coverUri} size="50x50" imageSize="200x200" />
                        <div className="player-track-info">
                            {currentSong.title ? (
                                <div className="player-track-info-title">
                                    {currentSong.title}
                                </div>
                            ) : (
                                <Skeleton variant="rounded" sx={{ bgcolor: '#ffffff1f' }} animation={false} width={50} height={10}></Skeleton>
                            )}
                            {currentSong.artists.length !== 0 ? (
                                <div className="player-track-info-artists-wrapper">
                                    <span onClick={(e) => { e.stopPropagation() }} className="track-info-artist-span">

                                        {currentSong.artists.map(artist => (
                                            <ArtistName size={"15px"} artist={artist} />
                                        ))}

                                    </span>
                                </div>
                            ) : (
                                <Skeleton variant="rounded" sx={{ bgcolor: '#ffffff1f', marginTop: "5px" }} animation={false} width={100} height={10}></Skeleton>
                            )}
                        </div>
                    </div>
                    <div className="player-primary-controls-mobile" onClick={(e) => { e.stopPropagation() }}>
                        <Box
                            className="player-primary-buttons-wrapper mobile"
                        >
                            <div className="player-navbar-button close" onClick={() => { setPlayerFolded(!playerFolded) }}>
                                <ExpandLess />
                            </div>
                            <PlayButton playing={playerState.playing} startFunc={startPlayerFunc} stopFunc={stopPlayerFunc} onKeyDown={(e: Event) => {
                                e.preventDefault();
                                handleKeyPress(e)
                            }} />
                            <IconButton onClick={skipForward} className="player-primary-button"
                                aria-label="next song">
                                <FastForwardRounded />
                            </IconButton>
                        </Box>
                    </div>
                    <div className="player-primary-seek-wrapper-mobile">
                        <SeekSlider loadingState={playerState.loading} position={position} duration={duration} changeTime={() => { }} />
                    </div>
                </div>
            }




            <Slide direction={"up"} in={!playerFolded}>
                <div ref={mobilePlayerFull} className="player-wrapper-full" onClick={() => { setPlayerFolded(true) }} style={{ marginBottom: "49px" }}>
                    {!playerFolded ? (
                        <>
                            <div className="player-navbar-full">
                                <div className="player-navbar-button close">
                                    <ExpandMore />
                                </div>
                                <div className="player-header-mobile-title" onClick={(e) => { e.stopPropagation() }}>{queueCurrentPlaylist.title}</div>
                                <div className="player-navbar-button queue" onClick={(e) => { setQueueOpen(!queueOpen); e.stopPropagation() }}>
                                    <ListIcon />
                                </div>
                            </div>
                            {/* cover row */}
                            <div className="player-full-top-wrapper">
                                <div className="player-track-cover-row-wrapper-full" key={currentSong.id} onClick={(e) => { e.stopPropagation() }}>
                                    <div key={String(playerState.shuffle)} className="player-track-cover-wrapper-full animated-translate prev" onClick={() => { skipBack() }}>
                                        <TrackCover coverUri={queue[queue.findIndex(x => x.track.id == currentSong.id) - 1]?.track.coverUri} size={"600x600"} imageSize={"1000x1000"} unWrapped />
                                    </div>
                                    <div className={`player-track-cover-wrapper-full ${playerState.playing ? "active" : ""}`} onClick={() => { !playerState.playing ? startPlayerFunc() : stopPlayerFunc() }}>
                                        <TrackCover placeholder={<ImagePlaceholder size='large' />} coverUri={currentSong.coverUri} size={"600x600"} imageSize={"1000x1000"} unWrapped />
                                    </div>
                                    <div key={String(playerState.shuffle) + 1} className="player-track-cover-wrapper-full animated-translate-right next" onClick={() => { skipForward() }}>
                                        <TrackCover coverUri={queue[queue.findIndex(x => x.track.id == currentSong.id) + 1]?.track.coverUri} size={"600x600"} imageSize={"1000x1000"} unWrapped />
                                    </div>
                                </div>
                                {/*track title and artists*/}
                                <div className="player-full-track-info-wrapper">
                                    <div className="player-track-info full">
                                        {currentSong.title ? (
                                            <div className="player-track-info-title">
                                                {currentSong.title}
                                            </div>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{ bgcolor: '#ffffff1f' }} animation={false} width={150} height={15}></Skeleton>
                                        )}
                                        {currentSong.artists.length !== 0 ? (
                                            <div className="player-track-info-artists-wrapper">
                                                <span onClick={(e) => { e.stopPropagation() }} className="track-info-artist-span">

                                                    {currentSong.artists.map(artist => (
                                                        <ArtistName size={"15px"} artist={artist} />
                                                    ))}

                                                </span>
                                            </div>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{ bgcolor: '#ffffff1f', marginTop: "5px" }} animation={false} width={200} height={15}></Skeleton>
                                        )}
                                    </div>
                                    <div className="player-track-info-controls" onClick={(e) => { e.stopPropagation() }}>
                                        {isLiked(currentSong.id) ? (
                                            <div
                                                className={`player-track-controls-likeButton ${isLiked(currentSong.id) ? "heart-pulse" : null}`}
                                                onClick={() => {
                                                    dislikeSong(currentSong).then((response) => updateLikedSongs("removed"))
                                                }}>
                                                <Favorite />
                                            </div>
                                        ) : (
                                            <div className={`player-track-controls-likeButton`} onClick={() => {
                                                likeSong(currentSong).then((response) => updateLikedSongs("liked"))
                                            }}>
                                                <FavoriteBorder />
                                            </div>
                                        )}
                                        <div className="track-controls-button" onClick={() => { setTrackInfoShowState(true); setTrackInfoState(currentSong) }}>
                                            <MoreVert />
                                        </div>
                                    </div>
                                </div>
                                <div className="player-primary-seek-wrapper-full" onClick={(e) => { e.stopPropagation() }}>
                                    <SeekSlider loadingState={playerState.loading} position={position} duration={duration} changeTime={changeTime} />
                                    <div className='player-primary-seek-time-full'>
                                        <div className="player-primary-trackTime">
                                            {secToMinutesAndSeconds(position)}
                                        </div>
                                        <div className="player-primary-trackTime">
                                            {secToMinutesAndSeconds(duration)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*PLAYER TRACK CONTROLS*/}


                            <div className="player-full-bottom-wrapper">
                                <div className="player-primary-controls-full">


                                    <Box onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                        className="player-primary-buttons-wrapper"
                                    >
                                        <div
                                            className={`player-primary-button mobile-func shuffle ${playerState.shuffle ? "active" : ""}`}
                                        ><Shuffle onClick={() => {
                                            setPlayerShuffle(!playerState.shuffle)
                                        }} /></div>
                                        <IconButton onClick={skipBack} className="player-primary-button mobile-secondary"
                                            aria-label="previous song">
                                            <FastRewindRounded />
                                        </IconButton>
                                        <PlayButton className="mobile-main" playing={playerState.playing} startFunc={startPlayerFunc} stopFunc={stopPlayerFunc} onKeyDown={(e: Event) => {
                                            e.preventDefault();
                                            handleKeyPress(e)
                                        }} />
                                        <IconButton onClick={skipForward} className="player-primary-button mobile-secondary"
                                            aria-label="next song">
                                            <FastForwardRounded />
                                        </IconButton>
                                        <div
                                            className={`player-primary-button mobile-func repeat ${playerState.repeat ? "active" : ""}`}
                                        ><Repeat onClick={() => {
                                            setPlayerRepeat(!playerState.repeat)
                                        }} /></div>
                                    </Box>
                                </div>
                                <div className="player-secondary-controls-full">
                                    <div className="player-track-controls-full">

                                    </div>
                                </div>
                            </div>
                        </>)
                        : null}
                </div>
            </Slide>
            <audio key={currentSong.id + "_player"} crossOrigin="anonymous"
                ref={audioElem}
                onPlay={(e) => {
                    devLog(`player started: ${currentSong.title} with src: ${audioElem.current?.src}}`)
                }}
                onLoadStart={(e) => {
                    setLoading(true)
                }}
                onError={(e) => {
                    //   stopPlayerFunc()
                    devLog(`player error`)
                    setLoading(false)
                }}
                onCanPlay={() => {
                    setLoading(false)
                     if (playerState.playing && audioElem.current) audioElem.current.play()
                    //   startPlayerFunc()
                }}  
                onPause={() => {
                    if (playerState.playing) stopPlayerFunc()
                    devLog(`player paused`)
                }} onEnded={(e) => {
                    skipForward()
                    startPlayerFunc()
                }} onTimeUpdate={onPlaying}></audio>
        </>
    )
}

export default Player;


