import React, {useEffect, useState} from 'react';
import {Box, IconButton, Skeleton} from "@mui/material";
import Slider from '@mui/material/Slider';
import {
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
import Cover, {ImagePlaceholder} from '../../Cover';
import {PositionInChart} from "../../Track";
import ArtistName from "../../ArtistName";
import LikeButton from "../../LikeButton";
import {secToMinutesAndSeconds} from "../../../utils/utils";
import SeekSlider from "./SeekSlider";

interface PlayerPropsT {
    currentSong: TrackT,
    position: number,
    duration: number,
    volume: number,
    changeVolume: (value: number)=>void,
    skipForward: ()=>void,
    skipBack: ()=>void,
    seekTo: (value:number)=>void,
}


const PlayerDesktop = ({currentSong, position, volume, changeVolume, duration, skipForward,skipBack, seekTo}:PlayerPropsT) => {
    const dispatch = useAppDispatch()
    const setPlayerShuffle = (shuffle: boolean) => dispatch(setShuffle(shuffle))
    const setPlayerRepeat = (repeat: boolean) => dispatch(setRepeat(repeat))
    const playerState = useAppSelector((state: RootState) => state.player)
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const setQueueOpen = (open: boolean) => dispatch(setOpeningState(open))
    const queueOpen = useAppSelector((state: RootState) => state.playingQueue.queue.queueOpen)
    const [queueButton, setQueueButton] = useState<DOMRect>()

    const handleKeyPress = (e: any) => {
        if (e.key === " " && e.srcElement?.tagName !== "INPUT") {
            e.preventDefault()

            !playerState.playing ? startPlayerFunc() : stopPlayerFunc()
        }
    }

    return (
        <>
            <div className="player-wrapper">
                <div className="player-track-info-wrapper" key={currentSong.id}>
                    <Cover placeholder={<ImagePlaceholder size="medium" />} coverUri={currentSong.coverUri}
                           size="60x60" imageSize="200x200" />
                    <div className="player-track-info">
                        {currentSong.title ? (
                            <div className='track-info-title-wrapper'>
                                {currentSong.chart && <PositionInChart position={currentSong.chart.position}/>}
                                <div className="player-track-info-title">
                                    {currentSong.title}
                                </div>
                            </div>
                        ) : (
                            <Skeleton variant="rounded" sx={{ bgcolor: '#ffffff1f' }} animation={false} width={50}
                                      height={10}></Skeleton>
                        )}
                        {currentSong.artists.length !== 0 ? (
                            <div className="player-track-info-artists-wrapper">
                                    <span onClick={(e) => {
                                        e.stopPropagation()
                                    }} className="track-info-artist-span">

                                        {currentSong.artists.map(artist => (
                                            <ArtistName size={"15px"} artist={artist} />
                                        ))}

                                    </span>
                            </div>
                        ) : (
                            <Skeleton variant="rounded" sx={{ bgcolor: '#ffffff1f', marginTop: "5px" }}
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
                                    duration={duration} changeTime={seekTo} />
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
                                    }}}
                                aria-label="Default" valueLabelDisplay="auto"/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlayerDesktop;


