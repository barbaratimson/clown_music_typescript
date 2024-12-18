import React, {memo, useEffect, useRef, useState} from 'react';
import {Box, IconButton, Skeleton, Slide} from "@mui/material";
import {addAlpha, secToMinutesAndSeconds} from "../../../utils/utils";
import ArtistName from '../../ArtistName';
import {
    ExpandLess,
    ExpandMore,
    FastForwardRounded,
    FastRewindRounded, Info, KeyboardArrowDown,
    MoreVert, PeopleAlt, PlaylistAdd,
    Repeat, Reply,
    Shuffle,
} from '@mui/icons-material';
import ListIcon from '@mui/icons-material/List';
import SeekSlider from './SeekSlider';
import PlayButton from './PlayButton';
import Cover, {ImagePlaceholder} from '../../Cover';
import {PositionInChart} from '../../Track';
import LikeButton from '../../LikeButton';
import {playerStart, playerStop, setRepeat, setShuffle} from "../playerSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import {TrackT} from "../../../utils/types/types";
import {setTrackInfo, setTrackInfoActiveState} from "../../../store/trackInfoSlice";
import {addTrackToQueuePosition, setOpeningState} from "../../../store/playingQueueSlice";
import {useLocation, useNavigate} from "react-router-dom";

interface PlayerMobilePropsT {
    position: number,
    duration: number,
    currentSong: TrackT,
    changeVolume: (value: number) => void,
    skipForward: () => void,
    skipBack: () => void,
    seekTo: (value: number) => void,
}

const PlayerMobile = ({currentSong, position, duration, skipForward, skipBack, seekTo}: PlayerMobilePropsT) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const location = useLocation()
    const [playerFolded, setPlayerFolded] = useState(true)
    const setPlayerShuffle = (shuffle: boolean) => dispatch(setShuffle(shuffle))
    const setPlayerRepeat = (repeat: boolean) => dispatch(setRepeat(repeat))
    const playerState = useAppSelector((state: RootState) => state.player)
    const setTrackInfoState = (track: TrackT) => dispatch(setTrackInfo(track))
    const setTrackInfoShowState = (active: boolean) => dispatch(setTrackInfoActiveState(active))
    const mobilePlayerFull = useRef<HTMLDivElement>(null)
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setQueueOpen = (open: boolean) => dispatch(setOpeningState(open))
    const queueCurrentFilter = useAppSelector((state: RootState) => state.playingQueue.queue.filteredBy)
    const queueCurrentPlaylist = useAppSelector((state: RootState) => state.playingQueue.queue.playlist)
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    const queue = useAppSelector((state: RootState) => state.playingQueue.queue.queueTracks)

    useEffect(() => {
        if (!playerFolded) {
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [playerFolded]);


    useEffect(() => {
        setPlayerFolded(true)
    }, [location])

    return (
        <>
            {playerFolded &&
                <div className="player-wrapper" onClick={() => {
                    setPlayerFolded(!playerFolded)
                }} style={{marginBottom: "37px", gap: "0"}}>
                    <div className="player-track-info-wrapper mobile" key={currentSong.id}>
                        <Cover placeholder={<ImagePlaceholder size="medium"/>} coverUri={currentSong.coverUri}
                               size="50x50" imageSize="200x200"/>
                        <div className="player-track-info">
                            {currentSong.title ? (
                                <div className='track-info-title-wrapper'>
                                    {currentSong.chart && <PositionInChart position={currentSong.chart.position}/>}
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
                                            <ArtistName key={artist.id} size={"15px"} artist={artist}/>
                                        ))}

                                    </span>
                                </div>
                            ) : (
                                <Skeleton variant="rounded" sx={{bgcolor: '#ffffff1f', marginTop: "5px"}}
                                          animation={false} width={100} height={10}></Skeleton>
                            )}
                        </div>
                    </div>
                    <div className="player-primary-controls-mobile" onClick={(e) => {
                        e.stopPropagation()
                    }}>
                        <Box
                            className="player-primary-buttons-wrapper mobile"
                        >
                            <div className="player-navbar-button close" onClick={() => {
                                setPlayerFolded(!playerFolded)
                            }}>
                                <ExpandLess/>
                            </div>
                            <PlayButton playing={playerState.playing} startFunc={startPlayerFunc}
                                        stopFunc={stopPlayerFunc} onKeyDown={(e: Event) => {
                                e.preventDefault();
                            }}/>
                            <IconButton onClick={skipForward} className="player-primary-button"
                                        aria-label="next song">
                                <FastForwardRounded/>
                            </IconButton>
                        </Box>
                    </div>
                    <div className="player-primary-seek-wrapper-mobile">
                        <SeekSlider loadingState={playerState.loading} position={position} duration={duration}
                                    changeTime={() => {
                                    }}/>
                    </div>
                </div>
            }


            <Slide direction={"up"} in={!playerFolded}>
                <div ref={mobilePlayerFull}
                     style={{backgroundColor: currentSong.derivedColors?.average ?? "#99999", marginBottom: "49px"}}
                     className="player-wrapper-full" onClick={() => {
                    setPlayerFolded(true)
                }}>
                    {!playerFolded ? (
                            <>
                                <div className="player-navbar-full">
                                    <div className="player-navbar-button close">
                                        <ExpandMore/>
                                    </div>
                                    <div className="player-header-mobile-title-wrapper">
                                        <div className="player-header-mobile-title" onClick={(e) => {
                                            e.stopPropagation();
                                        }}>{queueCurrentPlaylist.title.charAt(0).toUpperCase() + queueCurrentPlaylist.title.slice(1)}</div>
                                        <span className="player-header-mobile-filters">
                                        <>
                                        {queueCurrentFilter?.slice(0, 3).map((filter) => (
                                            <a key={filter + "_player_filter"}
                                               className="player-header-mobile-filters-filter">
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </a>
                                        ))}
                                            {queueCurrentFilter ? queueCurrentFilter.length > 2 ?
                                                <a className="player-header-mobile-filters-filter">
                                                    And more...
                                                </a>
                                                : null : null}
                                        </>
                                    </span>
                                    </div>
                                    <div className="player-navbar-button queue" onClick={(e) => {
                                        setQueueOpen(!queueOpen);
                                        e.stopPropagation()
                                    }}>
                                        <ListIcon/>
                                    </div>
                                </div>
                                {/* cover row */}
                                <div className="player-full-top-wrapper">
                                    <div className="player-track-cover-row-wrapper-full" key={currentSong.id}
                                         onClick={(e) => {
                                             e.stopPropagation()
                                         }}>
                                        <div key={String(playerState.shuffle)}
                                             className="player-track-cover-wrapper-full animated-translate prev"
                                             onClick={() => {
                                                 skipBack()
                                             }}>
                                            <Cover
                                                coverUri={queue[queue.findIndex(x => x.track.id == currentSong.id) - 1]?.track.coverUri}
                                                size={"200x200"} unWrapped/>
                                        </div>
                                        <div
                                            className={`player-track-cover-wrapper-full ${playerState.playing ? "active" : ""}`}
                                            onClick={() => {
                                                !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
                                            }}>
                                            <Cover placeholder={<ImagePlaceholder size='large'/>}
                                                   coverUri={currentSong.ogImage} size={"800x800"} unWrapped/>
                                        </div>
                                        <div key={String(playerState.shuffle) + 1}
                                             className="player-track-cover-wrapper-full animated-translate-right next"
                                             onClick={() => {
                                                 skipForward()
                                             }}>
                                            <Cover
                                                coverUri={queue[queue.findIndex(x => x.track.id == currentSong.id) + 1]?.track.coverUri}
                                                size={"200x200"} unWrapped/>
                                        </div>
                                    </div>
                                    {/*track title and artists*/}
                                    <div className="player-full-track-info-wrapper">
                                        <div className="player-track-info full">
                                            {currentSong.title ? (
                                                <div className='track-info-title-wrapper full'>
                                                    {currentSong.chart &&
                                                        <PositionInChart position={currentSong.chart.position}/>}
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
                                        </Box>
                                    </div>
                                    <div className="player-secondary-controls-full" onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        <div className="player-track-controls-full">
                                            <div className="track-controls-button">
                                                <Reply/>
                                            </div>

                                            <div
                                                className={`player-primary-button mobile-func repeat ${playerState.repeat ? "active" : ""}`}
                                            ><Repeat onClick={() => {
                                                setPlayerRepeat(!playerState.repeat)
                                            }}/>
                                            </div>

                                            <div className="track-controls-button" onClick={() => {
                                                navigate(`/artist/${currentSong.artists[0].id}`)
                                            }}>
                                                <PeopleAlt/>
                                            </div>


                                            <div
                                                className={`player-primary-button mobile-func shuffle ${playerState.shuffle ? "active" : ""}`}
                                            ><Shuffle onClick={() => {
                                                setPlayerShuffle(!playerState.shuffle)
                                            }}/>
                                            </div>

                                            <div className="track-controls-button" onClick={() => {
                                                setTrackInfoShowState(true);
                                                setTrackInfoState(currentSong)
                                            }}>
                                                <Info/>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </>)
                        : null}
                </div>
            </Slide>
        </>
    )
}


export default PlayerMobile;


