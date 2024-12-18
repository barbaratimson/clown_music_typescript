import React, {useEffect, useRef, useState} from 'react';
import {TrackDefaultT, TrackT, TrackType} from "../../utils/types/types";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop, setIsLoading} from "./playerSlice";
import {getImageLink, getUniqueRandomTrackFromPlaylist, randomSongFromTrackList} from "../../utils/utils";
import {fetchYaSongLink} from '../../utils/apiRequests';
import {showMessage} from '../../store/MessageSlice';
import {addTrackToQueue, setQueue} from "../../store/playingQueueSlice";
import {trackWrap} from '../../utils/trackWrap';
import {logMessage} from "../../store/devLogSlice";
import Audio from "./Audio";
import PlayerMobile from "./PlayerUI/PlayerMobile";
import {deviceState, getIsMobile, handleSubscribe, onSubscribe} from "../../utils/deviceHandler";
import PlayerDesktop from './PlayerUI/PlayerDesktop';


const savedVolume = localStorage.getItem("player_volume")
const Player = () => {
    const dispatch = useAppDispatch()
    const audioElem = useRef<HTMLAudioElement>(null)
    const [position, setPosition] = useState(0)
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const [duration, setDuration] = useState(0)
    const playerState = useAppSelector((state: RootState) => state.player)
    const queue = useAppSelector((state: RootState) => state.playingQueue.queue.queueTracks)
    const queueCurrentPlaylist = useAppSelector((state: RootState) => state.playingQueue.queue.playlist)
    const [playerVolume, setPlayerVolume] = useState<number>(Number(savedVolume) ?? 50)
    const [isMobile, setIsMobile] = useState(false)
    const [buffered, setBuffered] = useState<number>()
    const setLoading = (loading: boolean) => dispatch(setIsLoading(loading))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))
    const setPlayingQueue = (queue: Array<TrackDefaultT>) => dispatch(setQueue(queue))
    const addToQueue = (track: TrackType) => dispatch(addTrackToQueue(track))
    const devLog = (message: string) => dispatch(logMessage(message))
    const message = (message: string) => dispatch(showMessage(message))

    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()
            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
        }
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


    const getVolume = () => {
        if (isMobile) {
            return parseFloat(localStorage.getItem("mobilePlayer_volume") ?? "1")
        } else {
            return parseInt(localStorage.getItem("player_volume") ?? "100") * 0.25 / 100
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
        } else if (index === queue.length - 1) {
            if (playerState.shuffle && queueCurrentPlaylist.tracks.length !== 1) {
                setPlayingQueue([trackWrap(currentSong)])
            } else {
                setCurrentSong(queue[0].track)
            }
        } else {
            setCurrentSong(queue[index + 1].track)
        }
    }

    useEffect(() => {
        if (!audioElem.current) {
            return
        }
        if (!playerState.playing) {
            audioElem.current.pause()
        } else {
            audioElem.current.play().catch(_ => {

            })
        }
    }, [playerState]);

    useEffect(() => {
        if (currentSong.id === 0 && currentSong.title === "") return;
        const fetchAudioAndPlay = () => {
            if (!audioElem.current) return
            audioElem.current.src = "";
            audioElem.current.load()
            setLoading(true)
            devLog(`start fetching song link`)
            fetchYaSongLink(currentSong.id)
                .then(link => {
                    devLog(`song link ready ${link}`)
                    if (!audioElem.current) return
                    if (!link) {
                        devLog(`Link fetching rejected`)
                        message(`${currentSong.title} link loading error`)
                    } else {
                        audioElem.current.src = link;
                        audioElem.current.load()
                        if (playerState.playing) {
                            audioElem.current.play().catch(_ => {
                            })
                        }
                    }
                })
                .catch(e => {
                    if (e.code !== 20 && e.code !== 9) {
                        message(e)
                    }
                    console.error(e.code)
                    devLog(`error while fetching link: ${e.name && JSON.stringify(e)}`)
                }).finally(() => {
                setLoading(false)
            })
        }
        devLog(`current song changed: ${currentSong.id} ${currentSong.title}`)
        if (currentSong.available && currentSong && audioElem.current) {
            const volume = localStorage.getItem("player_volume")
            audioElem.current.volume = getVolume()
            changeTime(0)
            setPosition(0)
        }

        fetchAudioAndPlay()

        const index = queue.findIndex(x => x.id == currentSong.id);
        if (playerState.shuffle && index === queue.length - 1 && queueCurrentPlaylist.tracks.length !== 1) {
            const newSong = getUniqueRandomTrackFromPlaylist(queueCurrentPlaylist.tracks, queue, currentSong)
            if (!newSong) return
            if (queueCurrentPlaylist.tracks.length <= queue.length) {
                setPlayingQueue([trackWrap(currentSong), newSong])
            } else {
                addToQueue(newSong)
            }
        }
    }, [currentSong]);


    useEffect(() => {
        setMediaSession(currentSong)
        const getIsMobileInfo = () => {
            handleSubscribe()
            onSubscribe()
            setIsMobile(getIsMobile(deviceState))
            console.log(getIsMobile(deviceState))
        }
        getIsMobileInfo()
    }, []);

    useEffect(() => {
        setMediaSession(currentSong)
    }, [currentSong, queue]);

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress)
    });

    useEffect(() => {
        if (audioElem.current) {
            audioElem.current.volume = getVolume()
            localStorage.setItem("player_volume", playerVolume.toString())
        }
    }, [playerVolume]);

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

    return (
        <>
            {isMobile ?
                (<PlayerMobile
                    currentSong={currentSong}
                    position={position}
                    duration={duration}
                    changeVolume={setPlayerVolume}
                    skipForward={skipForward}
                    skipBack={skipBack}
                    seekTo={changeTime}/>)
                :
                (<PlayerDesktop
                    currentSong={currentSong}
                    position={position}
                    duration={duration}
                    volume={playerVolume}
                    changeVolume={setPlayerVolume}
                    skipForward={skipForward}
                    skipBack={skipBack}
                    seekTo={changeTime}/>)
            }
            <Audio
                track={currentSong}
                crossOrigin="anonymous"
                preload="auto"
                ref={audioElem}
                onPlay={(e) => {
                    devLog(`player started: ${currentSong.title} with src: ${audioElem.current?.src}}`)
                }}
                onLoadedMetadata={(e) => {
                    setLoading(false)
                }}
                onError={(e) => {
                    e.preventDefault()
                    devLog(`player error`)
                    setLoading(false)
                }}
                onEnded={(e) => {
                skipForward()
                startPlayerFunc()
            }} onTimeUpdate={onPlaying}
            />
        </>
    )
}

export default Player;


