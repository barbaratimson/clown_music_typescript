import React, {useEffect, useState} from 'react';
import {Box, IconButton, Skeleton} from "@mui/material";
import Slider from '@mui/material/Slider';
import {
    ArrowBack,
    FastForwardRounded,
    FastRewindRounded,
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
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import {playerStart, playerStop, setRepeat, setShuffle} from "../playerSlice";
import {TrackT} from "../../../utils/types/types";
import {setOpeningState} from "../../../store/playingQueueSlice";
import Cover, {ImagePlaceholder} from '../../UI/Cover';
import Track, {PositionInChart} from "../../Track";
import ArtistName from "../../ArtistName";
import LikeButton from "../../LikeButton";
import {secToMinutesAndSeconds} from "../../../utils/utils";
import SeekSlider from "./SeekSlider";
import {getCMImageUrl} from "../../../utils/cmApiRequsts";
import "./PlayerDesktop.scss"
import {BiArrowToTop} from "react-icons/bi";
import PlayButton from "./PlayButton";

interface PlayerPropsT {
    currentSong: TrackT,
    position: number,
    duration: number,
    volume: number,
    changeVolume: (value: number) => void,
    skipForward: () => void,
    skipBack: () => void,
    seekTo: (value: number) => void,
}


const PlayerDesktop = ({
                           currentSong,
                           position,
                           volume,
                           changeVolume,
                           duration,
                           skipForward,
                           skipBack,
                           seekTo
                       }: PlayerPropsT) => {
    const dispatch = useAppDispatch()
    const setPlayerShuffle = (shuffle: boolean) => dispatch(setShuffle(shuffle))
    const setPlayerRepeat = (repeat: boolean) => dispatch(setRepeat(repeat))
    const playerState = useAppSelector((state: RootState) => state.player)
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setQueueOpen = (open: boolean) => dispatch(setOpeningState(open))
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    const [queueButton, setQueueButton] = useState<DOMRect>()
    const queueCurrentPlaylist = useAppSelector((state: RootState) => state.playingQueue.queue.playlist)
    const queue = useAppSelector((state: RootState) => state.playingQueue.queue.queueTracks)

    const [isOpen, setIsOpen] = useState(false)

    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()

            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "visible"
        }
    }, [isOpen]);

    return (
        <>
            {!isOpen ? (

                <div className="player-wrapper">
                    <div className="player-track-info-wrapper" key={currentSong.id}>
                        <Cover placeholder={<ImagePlaceholder size="medium"/>}
                               src={getCMImageUrl(currentSong.cover?.id, "120x120")}
                               size="60x60" imageSize="200x200"/>
                        <div className="player-track-info">
                            {currentSong.title ? (
                                <div className='track-info-title-wrapper'>
                                    {/*{currentSong.chart && <PositionInChart position={currentSong.chart.position}/>}*/}
                                    <div className="player-track-info-title">
                                        {currentSong.title}
                                    </div>
                                </div>
                            ) : (
                                <Skeleton variant="rounded" sx={{bgcolor: '#ffffff1f'}} animation={false} width={50}
                                          height={10}></Skeleton>
                            )}
                            {currentSong.artists.length !== 0 ? (
                                <div className="player-track-info-artists-wrapper">
                                    <span onClick={(e) => {
                                        e.stopPropagation()
                                    }} className="track-info-artist-span">

                                        {currentSong.artists.map(artist => (
                                            <ArtistName size={"15px"} artist={artist}/>
                                        ))}

                                    </span>
                                </div>
                            ) : (
                                <Skeleton variant="rounded" sx={{bgcolor: '#ffffff1f', marginTop: "5px"}}
                                          animation={false} width={100} height={10}></Skeleton>
                            )}
                        </div>
                        <div className="player-track-controls">
                            <div key={currentSong.id} className="player-track-controls-border">
                                <LikeButton track={currentSong}/>
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
                                {secToMinutesAndSeconds(position)}
                            </div>
                            <SeekSlider loadingState={playerState.loading} position={position}
                                        duration={duration} changeTime={seekTo}/>
                            <div className="player-primary-trackTime">
                                {secToMinutesAndSeconds(duration)}
                            </div>
                        </div>
                    </div>
                    <div className="player-secondary-controls">
                        <div className="player-button-row">
                            <div className="player-queue-button" onClick={(e) => {
                                setQueueOpen(!queueOpen);
                                setQueueButton(e.currentTarget.getBoundingClientRect())
                            }}><ListIcon/></div>
                            <div className="player-button-row">
                                <div className="player-queue-button" onClick={() => {
                                    setIsOpen(true)
                                }}><BiArrowToTop/></div>
                            </div>
                        </div>
                        <div className="player-volume-wrapper">
                            {volume === 0 ? (
                                <VolumeOff/>
                            ) : volume <= 33 ? (
                                <VolumeMute/>
                            ) : volume <= 66 ? (
                                <VolumeDown/>
                            ) : volume <= 100 ? (
                                <VolumeUp/>
                            ) : null}
                            <Slider size="small"
                                    value={volume}
                                    max={100}
                                    step={1}
                                    onChange={(_, value) => changeVolume(value as number)}
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
                                        }
                                    }}
                                    aria-label="Default" valueLabelDisplay="auto"/>
                        </div>
                    </div>
                </div>


            ) : (


                <div className="player-desktop-full-wrapper" onClick={() => {
                    setIsOpen(false)
                }}>
                    <div className="player-desktop-full-track-wrapper">
                        <div className="" onClick={(e) => {
                            e.stopPropagation()
                        }}>

                            <div className="player-desktop-full-top-wrapper">
                                <div className="player-track-cover-row-wrapper-full" style={{margin: 0, height:"fit-content"}} key={currentSong.id}
                                     onClick={(e) => {
                                         e.stopPropagation()
                                     }}>
                                    <div
                                        className={`player-track-cover-wrapper-full`}
                                        onClick={() => {
                                            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
                                        }}>
                                        <Cover placeholder={<ImagePlaceholder size='large'/>}
                                               src={getCMImageUrl(currentSong.cover?.id, "800x800")} size={"800x800"} unWrapped/>
                                    </div>
                                </div>
                                {/*track title and artists*/}
                                <div className="player-full-track-info-wrapper">
                                    <div className="player-track-info full">
                                        {currentSong.title ? (
                                            <div className='track-info-title-wrapper full'>
                                                {/*{currentSong.chart &&*/}
                                                {/*    <PositionInChart position={currentSong.chart.position}/>}*/}
                                                <div className="player-track-info-title"
                                                     style={{fontSize: "20px !important"}}>
                                                    {currentSong.title}
                                                </div>
                                            </div>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{bgcolor: '#ffffff1f'}} animation={false}
                                                      width={150} height={15}></Skeleton>
                                        )}
                                        {currentSong.artists.length !== 0 ? (
                                            <div className="player-track-info-artists-wrapper">
                                                <span onClick={(e) => {
                                                    e.stopPropagation()
                                                }} className="track-info-artist-span">

                                                    {currentSong.artists.map(artist => (
                                                        <ArtistName key={artist.id} size={"15px"} artist={artist}/>
                                                    ))}

                                                </span>
                                            </div>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{bgcolor: '#ffffff1f', marginTop: "5px"}}
                                                      animation={false} width={200} height={15}></Skeleton>
                                        )}
                                    </div>
                                    <div className="player-track-info-controls" onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <LikeButton silent track={currentSong}/>

                                        {/*<div className="track-controls-button" onClick={() => {*/}
                                        {/*    setTrackInfoShowState(true);*/}
                                        {/*    setTrackInfoState(currentSong)*/}
                                        {/*}}>*/}
                                        {/*    <MoreVert />*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                                <div className="player-primary-seek-wrapper-full" onClick={(e) => {
                                    e.stopPropagation()
                                }}>
                                    <SeekSlider loadingState={playerState.loading} position={position}
                                                duration={duration} changeTime={seekTo}/>
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
                                        <div className={`player-primary-button shuffle ${playerState.shuffle ? "active" : ""}`}
                                        ><Shuffle onClick={() => {
                                            setPlayerShuffle(!playerState.shuffle)
                                        }}/></div>
                                        <IconButton onClick={skipBack}
                                                    className="player-primary-button mobile-secondary"
                                                    aria-label="previous song">
                                            <FastRewindRounded/>
                                        </IconButton>
                                        <PlayButton className="mobile-main" playing={playerState.playing}
                                                    startFunc={startPlayerFunc} stopFunc={stopPlayerFunc}
                                                    onKeyDown={(e: Event) => {
                                                        e.preventDefault();
                                                    }}/>
                                        <IconButton onClick={skipForward}
                                                    className="player-primary-button mobile-secondary"
                                                    aria-label="next song">
                                            <FastForwardRounded/>
                                        </IconButton>
                                        <div className={`player-primary-button repeat ${playerState.repeat ? "active" : ""}`}
                                        ><Repeat onClick={() => {
                                            setPlayerRepeat(!playerState.repeat)
                                        }}/></div>
                                    </Box>
                                </div>
                            </div>


                            <div className="player-desktop-full-secondary-controls" onClick={(e) => {
                                e.stopPropagation()
                            }}>
                                <div className="player-volume-wrapper">
                                    {volume === 0 ? (
                                        <VolumeOff/>
                                    ) : volume <= 33 ? (
                                        <VolumeMute/>
                                    ) : volume <= 66 ? (
                                        <VolumeDown/>
                                    ) : volume <= 100 ? (
                                        <VolumeUp/>
                                    ) : null}
                                    <Slider size="small"
                                            value={volume}
                                            max={100}
                                            step={1}
                                            onChange={(_, value) => changeVolume(value as number)}
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
                                                }
                                            }}
                                            aria-label="Default" valueLabelDisplay="auto"/>
                                </div>
                            </div>
                        </div>
                        <div className="player-desktop-full-queue-wrapper">
                                <div className="player-desktop-full-queue-wrapper-songs-wrapper">
                                    {queue ? queue.map((song) => (
                                        <Track key={song.id} track={song}/>
                                    )) : null}
                                </div>
                        </div>
                    </div>
                    <div className="player-mobile-bg">
                        <div className="player-mobile-bg-blur"></div>
                        <img className="player-mobile-bg-img" src={getCMImageUrl(currentSong.cover?.id, "50x50")}></img>
                    </div>
                </div>
            )}
        </>
    )
}

export default PlayerDesktop;


