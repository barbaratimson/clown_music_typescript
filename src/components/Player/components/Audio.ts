// import React, {useEffect, useRef, useState} from 'react';
// import {TrackDefaultT, TrackId, TrackT, TrackType} from "../../../utils/types/types";
// import {RootState, useAppDispatch, useAppSelector} from "../../../store";
// import {changeCurrentSong} from "../../../store/CurrentSongSlice";
// import {playerStart, playerStop, setCurrentTime, setDuration, setIsLoading, setSrc} from "../../../store/PlayerSlice";
// import {addAlpha, getImageLink} from "../../../utils/utils";
// import {fetchLikedSongs, fetchYaSongLink} from '../../../utils/apiRequests';
// import {addTrackToQueue, setOpeningState, setQueue} from "../../../store/playingQueueSlice";
// import {trackWrap} from '../../../utils/trackWrap';
// import {usePalette} from 'react-palette';
//
//
// const savedVolume = localStorage.getItem("player_volume")
// const Player = () => {
//     const dispatch = useAppDispatch()
//     const audioElem = document.createElement("audio")
//     const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
//     const playerState = useAppSelector((state: RootState) => state.player)
//     const queue = useAppSelector((state: RootState) => state.playingQueue.queue.queueTracks)
//     const queueCurrentPlaylist = useAppSelector((state: RootState) => state.playingQueue.queue.playlist)
//     const [playerFolded, setPlayerFolded] = useState(true)
//     const mobilePlayerInitialVolume = process.env.REACT_APP_MOBILE_PLAYER_VOLUME
//
//     const setPlayerSrc = (link: string) => dispatch(setSrc(link))
//     const setLoading = (loading: boolean) => dispatch(setIsLoading(loading))
//     const stopPlayerFunc = () => dispatch(playerStop())
//     const startPlayerFunc = () => dispatch(playerStart())
//
//     const setPlayerPosition = (position: number) => dispatch(setCurrentTime(position))
//     const setPlayerDuration = (duration: number) => dispatch(setDuration(duration))
//     const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))
//     const mobilePlayerFull = useRef<HTMLDivElement>(null)
//     const setPlayingQueue = (queue: Array<TrackDefaultT>) => dispatch(setQueue(queue))
//     const addToQueue = (track: TrackType) => dispatch(addTrackToQueue(track))
//
//     const {
//         data,
//         loading,
//         error
//     } = usePalette(currentSong && currentSong.coverUri ? `http://${currentSong.coverUri.substring(0, currentSong.coverUri.lastIndexOf('/'))}/800x800` : "")
//
//     const setup = () => {
//         audioElem.addEventListener('durationchange', () =>
//             setState({ duration: audioElem.duration }),
//         );
//
//         audioElem.addEventListener('playing', () => setState({ playing: true }));
//
//         audioElem.addEventListener('pause', () => setState({ playing: false }));
//
//         audioElem.addEventListener('timeupdate', () => {
//             const newCurrentTime = Math.round(audioElem.currentTime);
//
//             if (currentTime !== newCurrentTime) {
//                 currentTime = newCurrentTime;
//
//                 pubsub.publish('change-current-time', currentTime);
//             }
//         });
//
//         audioElem.addEventListener('volumechange', () =>
//             setState({ volume: audioElem.volume }),
//         );
//
//         setState({ volume: audioElem.volume });
//     };
//
//     const handleKeyPress = (e: any) => {
//         if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
//             e.preventDefault()
//
//             !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
//         }
//     }
//
//
//     const setMediaSession = (track: TrackT) => {
//         navigator.mediaSession.metadata = new MediaMetadata({
//             title: track.title,
//             artist: track.artists && track.artists.length > 0 ? track.artists[0].name : "",
//             artwork: [
//                 {
//                     src: getImageLink(track.coverUri, "600x600") ?? "",
//                     sizes: "512x512",
//                     type: "image/png",
//                 },
//             ]
//         })
//
//         navigator.mediaSession.setActionHandler("previoustrack", skipBack);
//         navigator.mediaSession.setActionHandler("nexttrack", skipForward);
//
//         navigator.mediaSession.setActionHandler("seekto", (e) => {
//             if (e.seekTime && audioElem) {
//                 audioElem.currentTime = e.seekTime
//             }
//         });
//
//         navigator.mediaSession.setActionHandler("play", (e) => {
//             startPlayerFunc()
//         })
//
//         navigator.mediaSession.setActionHandler("pause", (e) => {
//             stopPlayerFunc()
//         })
//
//     }
//     const onPlaying = (e: any) => {
//         const duration = audioElem?.duration;
//         const currentTime = audioElem?.currentTime;
//         if (currentTime && duration) {
//             setPlayerDuration(duration)
//             setPlayerPosition(currentTime)
//         }
//     }
//
//     const changeTime = (value: number) => {
//         if (audioElem && audioElem.currentTime !== 0) {
//             audioElem.currentTime = value
//         }
//     }
//
//     const skipBack = () => {
//         const index = queue.findIndex(x => x.track.id == currentSong.id);
//         if (!audioElem) return
//         if (audioElem.currentTime >= 10) {
//             audioElem.currentTime = 0
//         } else if (index !== 0) {
//             setCurrentSong(queue[index - 1].track)
//         } else {
//             changeTime(0)
//         }
//     }
//
//     const skipForward = () => {
//         const index = queue.findIndex(x => x.track.id == currentSong.id);
//         if (!audioElem) return
//         if (playerState.repeat && audioElem.currentTime === audioElem.duration) {
//             audioElem.currentTime = 0
//             startPlayerFunc()
//         } else if (index === queue.length - 1) {
//             if (playerState.shuffle && queueCurrentPlaylist.tracks.length !== 1) {
//                 let newSong: TrackType;
//                 do {
//                     newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
//                 } while (currentSong.id == newSong.track.id)
//                 setPlayingQueue([trackWrap(currentSong), newSong])
//             } else {
//                 setCurrentSong(queue[0].track)
//             }
//         } else {
//             setCurrentSong(queue[index + 1].track)
//         }
//     }
//     const randomSongFromTrackList = (trackList: Array<TrackType>) => {
//         return trackList[Math.floor((Math.random() * trackList.length))]
//     }
//
//
//     useEffect(() => {
//         if (!audioElem) {
//             return
//         }
//         if (!playerState.playing) {
//             audioElem.pause()
//         } else {
//             audioElem.play().catch((e) => {
//             })
//         }
//     }, [playerState]);
//
//     useEffect(() => {
//         const changeTrack = async () => {
//             if (currentSong.available && currentSong) {
//                 stopPlayerFunc()
//                 setLoading(true)
//                 const trackLink = await fetchYaSongLink(currentSong.id)
//                 if (trackLink) {
//                     setPlayerSrc(trackLink)
//                 }
//             }
//         }
//         changeTrack()
//         if (queue.length !== 0 && currentSong.id !== 0) {
//             const index = queue.findIndex(x => x.id == currentSong.id);
//             if (playerState.shuffle && index === queue.length - 1 && queue.length !== queueCurrentPlaylist.tracks.length) {
//                 let newSong: TrackType;
//                 do {
//                     newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
//                 } while (queue.findIndex(x => x.track.id === newSong.track.id) !== -1)
//                 addToQueue(newSong)
//             }
//         }
//     }, [currentSong]);
//
//
//     useEffect(() => {
//         if (!playerFolded) {
//             document.body.style.overflow = "hidden"
//         }
//         return () => {
//             document.body.style.overflow = "unset"
//         }
//     }, [playerFolded]);
//
//     useEffect(() => {
//         setMediaSession(currentSong)
//         return () => {
//             navigator.mediaSession.metadata = null
//         }
//     }, []);
//
//     useEffect(() => {
//         setMediaSession(currentSong)
//         return () => {
//             navigator.mediaSession.metadata = null
//         }
//     }, [currentSong, queue]);
//
//     //Only in mobile player
//     useEffect(() => {
//         if (audioElem) {
//             audioElem.volume = Number(mobilePlayerInitialVolume) ?? 1
//             console.log(audioElem.volume)
//         }
//     }, [])
//
//     useEffect(() => {
//         window.addEventListener('keypress', handleKeyPress);
//         return () => window.removeEventListener('keypress', handleKeyPress)
//     });
//
//     useEffect(() => {
//         localStorage.setItem("player_repeat", playerState.repeat.toString())
//     }, [playerState.repeat]);
//
//     useEffect(() => {
//         localStorage.setItem("player_shuffle", playerState.shuffle.toString())
//         if (playerState.shuffle && queueCurrentPlaylist.tracks.length > 1) {
//             let newSong: TrackType;
//             do {
//                 newSong = randomSongFromTrackList(queueCurrentPlaylist.tracks)
//             } while (currentSong.id == newSong.track.id)
//             setPlayingQueue([trackWrap(currentSong), newSong])
//         } else {
//             setPlayingQueue(queueCurrentPlaylist.tracks)
//         }
//     }, [playerState.shuffle]);
//
//     // useEffect(() => {
//     //     if (!mobilePlayerFull || loading) return
//     //     if (data.darkMuted) {
//     //         mobilePlayerFull.style.backgroundColor = addAlpha(data.darkMuted, 0.7)
//     //     } else {
//     //         mobilePlayerFull.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
//     //     }
//     // }, [data])
//
//     return {
//
//     }
// }

const Audio = () => {

    return 
}

export default Audio;


