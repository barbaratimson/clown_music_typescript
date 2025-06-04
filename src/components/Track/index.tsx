import React, {useEffect, useState} from "react";
import {TrackId, TrackT} from "../../utils/types/types";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {changeCurrentSong} from "../../store/CurrentSongSlice";
import {playerStart, playerStop} from "../Player/playerSlice";
import {msToMinutesAndSeconds} from "../../utils/utils";
import {MoreVert, PauseRounded, PlayArrowRounded} from "@mui/icons-material";
import EqualizerIcon from "../../assets/EqualizerIcon";
import ArtistName from "../ArtistName";
import {setLikedSongs} from "../../store/LikedSongsSlice";
import {showMessage} from "../../store/MessageSlice";
import {trackWrap} from "../../utils/trackWrap";
import {setTrackInfo, setTrackInfoActiveState} from "../../store/trackInfoSlice";
import Cover, {ImagePlaceholder} from "../UI/Cover";
import LikeButton from "../LikeButton";
import TrackInfo from "../TrackInfo/TrackInfo";
import Button from "../UI/Button/Button";
import {getCMImageUrl} from "../../utils/cmApiRequsts";
import {deviceState, getIsMobile, handleSubscribe, onSubscribe} from "../../utils/deviceHandler";
import MobileTrackInfo from "../TrackInfo/MobileTrackInfo";
import {ContextMenu} from "../UI/ContextMenu/ContextMenu";

interface TrackProps {
    track: TrackT,
    queueFunc?: Function
    hideControls?: boolean
    isPlaying?: boolean
}

const link = process.env.REACT_APP_YMAPI_LINK

const Track = ({track, queueFunc, hideControls}: TrackProps) => {
    const dispatch = useAppDispatch()
    const currentSong = useAppSelector((state: RootState) => state.CurrentSongStore.currentSong)
    const playerState = useAppSelector((state: RootState) => state.player)
    const setCurrentSong = (track: TrackT) => dispatch(changeCurrentSong(track))
    const stopPlayerFunc = () => dispatch(playerStop())
    const startPlayerFunc = () => dispatch(playerStart())
    const trackInfoActive = useAppSelector(state => state.trackInfo.active)
    const trackInfoTrack = useAppSelector(state => state.trackInfo.track)
    const setTrackInfoActive = (active: boolean) => dispatch(setTrackInfoActiveState(active))
    const setTrackInfoTrack = (track: TrackT) => dispatch(setTrackInfo(track))
    const [isCurrentSong, setIsCurrentSong] = useState(false)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false)

    const changeSong = (song: TrackT) => {
        if (song.id != currentSong.id) {
            setCurrentSong(song);
            startPlayerFunc()
            if (queueFunc) {
                queueFunc([song]);
            }
        } else if (playerState.playing) {
            stopPlayerFunc()
        } else {
            startPlayerFunc()
        }
    }

    useEffect(() => {
        const getIsMobileInfo = () => {
            handleSubscribe()
            onSubscribe()
            setIsMobile(getIsMobile(deviceState))
        }
        getIsMobileInfo()
    }, []);

    useEffect(() => {
        setIsCurrentSong(currentSong.id === track.id)
    }, [currentSong, track.id])

    return (
        <>
            <div
                className={`group flex flex-row w-full p-1.5 rounded-2xl cursor-pointer transition-all duration-300
                    ${isCurrentSong ? "bg-white/25" : "bg-transparent hover:bg-white/15 hover:bg-opacity-6 hover:translate-x-1.5 sm:hover:bg-opacity-6 sm:hover:translate-x-1.5"}
                    active:transform-none
                `}
                onClick={() => {
                    changeSong(track)
                }}
            >
                <div
                    className="relative flex self-center justify-self-center min-w-[50px] h-[50px] rounded-xl overflow-hidden bg-bg-color-secondary_hover shadow-[0_0_5px_3px_rgba(44,44,44,0.2)]">
                    <div className={`
                        absolute inset-0 flex items-center text-white justify-center transition-opacity duration-300 bg-black/20 group-hover:opacity-100 z-[1]
                        ${isCurrentSong ? "opacity-100" : "opacity-0 hover:opacity-100"}
                        backdrop-blur-[0.5px]
                    `}>
                        {currentSong.id !== track.id ? (
                            <PlayArrowRounded/>
                        ) : playerState.playing ? (
                            <EqualizerIcon/>
                        ) : (
                            <PauseRounded/>
                        )}
                    </div>
                    <Cover
                        unWrapped
                        placeholder={<ImagePlaceholder size="medium"/>}
                        src={getCMImageUrl(track.cover?.id, "120x120")}
                        size="200x200"
                    />
                </div>

                <div
                    className="flex flex-col mx-2.5 justify-center text-white text-sm font-medium tracking-wider overflow-hidden whitespace-nowrap">
                    <div className="flex">
                        <div className="text-ellipsis overflow-hidden">
                            {track.title + `${track.version ? ` (${track.version})` : ""}`}
                        </div>
                    </div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-row gap-1 ml-0.5"
                    >
                        <span className="text-ellipsis overflow-hidden">
                            {track.artists.map(artist => (
                                <ArtistName key={artist.id} artist={artist}/>
                            ))}
                        </span>
                    </div>
                </div>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center ml-auto mr-2"
                >
                    {!hideControls && (
                        <Button
                            style={{padding: 0}}
                            onClick={(e) => {
                                setTrackInfoActive(!trackInfoActive)
                                setTrackInfoTrack(track)
                                setAnchorEl(e.currentTarget)
                            }}
                        >
                            <MoreVert/>
                        </Button>
                    )}
                </div>
            </div>

            {!isMobile && (
                <ContextMenu
                    active={trackInfoActive && track.id == trackInfoTrack.id}
                    setActive={setTrackInfoActive}
                    anchorEl={anchorEl}
                    position={"bottom"}
                    clickAway
                >
                    <TrackInfo track={track}/>
                </ContextMenu>
            )}
        </>
    )
}

interface PositionInChartProps {
    position: number,
    text?: string
}

export const PositionInChart = ({position, text}: PositionInChartProps) => {
    return (
        <div className="track-info-position">{text ?? "#" + position}</div>
    )
}

export default Track