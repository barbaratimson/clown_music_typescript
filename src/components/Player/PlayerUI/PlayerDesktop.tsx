import React, {useEffect, useState, useCallback, useMemo} from "react";
import {Box, IconButton, Skeleton} from "@mui/material";
import Slider from "@mui/material/Slider";
import {motion, AnimatePresence} from "framer-motion";
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
    VolumeUp,
} from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import {RootState, useAppDispatch, useAppSelector} from "../../../store";
import {playerStart, playerStop, setRepeat, setShuffle} from "../playerSlice";
import {TrackT} from "../../../utils/types/types";
import {setOpeningState} from "../../../store/playingQueueSlice";
import Cover, {ImagePlaceholder} from "../../UI/Cover";
import Track, {PositionInChart} from "../../Track";
import ArtistName from "../../ArtistName";
import LikeButton from "../../LikeButton";
import {secToMinutesAndSeconds} from "../../../utils/utils";
import SeekSlider from "./SeekSlider";
import {getCMImageUrl} from "../../../utils/cmApiRequsts";
import {BiArrowToTop} from "react-icons/bi";
import PlayButton from "./PlayButton";
import EqualizerIcon from "../../../assets/EqualizerIcon";
import Loader from "../../UI/Loader";

interface PlayerPropsT {
    currentSong: TrackT;
    position: number;
    duration: number;
    volume: number;
    changeVolume: (value: number) => void;
    skipForward: () => void;
    skipBack: () => void;
    seekTo: (value: number) => void;
}

export const PlayerDesktop = React.memo(({
                                             currentSong,
                                             position,
                                             volume,
                                             changeVolume,
                                             duration,
                                             skipForward,
                                             skipBack,
                                             seekTo,
                                         }: PlayerPropsT) => {
    const dispatch = useAppDispatch();
    const playerState = useAppSelector((state: RootState) => state.player);
    const queueOpen = useAppSelector(
        (state: RootState) => state.playingQueue.queue.queueOpen,
    );
    const queue = useAppSelector(
        (state: RootState) => state.playingQueue.queue.queueTracks,
    );

    const [isOpen, setIsOpen] = useState(false);

    // Memoized handlers to prevent unnecessary re-renders
    const setPlayerShuffle = useCallback((shuffle: boolean) => dispatch(setShuffle(shuffle)), [dispatch]);
    const setPlayerRepeat = useCallback((repeat: boolean) => dispatch(setRepeat(repeat)), [dispatch]);
    const stopPlayerFunc = useCallback(() => dispatch(playerStop()), [dispatch]);
    const startPlayerFunc = useCallback(() => dispatch(playerStart()), [dispatch]);
    const setQueueOpen = useCallback((open: boolean) => dispatch(setOpeningState(open)), [dispatch]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.key === " " && (e.target as HTMLElement)?.tagName !== "INPUT") {
            e.preventDefault();
            playerState.playing ? stopPlayerFunc() : startPlayerFunc();
        }
    }, [playerState.playing, startPlayerFunc, stopPlayerFunc]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "visible";
        return () => {
            document.body.style.overflow = "visible";
        };
    }, [isOpen]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    // Optimized shuffle handler with debounce
    const handleShuffle = useCallback(() => {
        setPlayerShuffle(!playerState.shuffle);
    }, [playerState.shuffle, setPlayerShuffle]);

    // Optimized repeat handler
    const handleRepeat = useCallback(() => {
        setPlayerRepeat(!playerState.repeat);
    }, [playerState.repeat, setPlayerRepeat]);

    // Optimized volume change handler
    const handleVolumeChange = useCallback((_: Event, value: number | number[]) => {
        changeVolume(value as number);
    }, [changeVolume]);

    // Memoized track list to prevent unnecessary re-renders
    const renderQueue = useMemo(() => (
        <AnimatePresence>
            {queue?.map((song, index) => (
                <motion.div
                    key={`${song.id}-${index}`} // Added index to key for better stability
                    custom={index}
                    variants={{
                        hidden: {opacity: 0, y: 20},
                        visible: (i) => ({
                            opacity: 1,
                            y: 0,
                            transition: {
                                // delay: i * 0.05,
                                duration: 0.2,
                                ease: "easeOut"
                            }
                        }),
                        exit: {opacity: 0, x: -50}
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                >
                    <Track track={song}/>
                </motion.div>
            ))}
        </AnimatePresence>
    ), [queue]);

    // Simplified volume icon selection
    const VolumeIcon = useMemo(() => {
        if (volume === 0) return VolumeOff;
        if (volume <= 33) return VolumeMute;
        if (volume <= 66) return VolumeDown;
        return VolumeUp;
    }, [volume]);

    return (
        <>
            {!isOpen ? (
                <div
                    className="fixed flex flex-row items-center bottom-0 w-full p-2.5 bg-black bg-opacity-50 backdrop-blur-sm rounded-tl-xl rounded-tr-xl gap-10 transition-all duration-400 ease-in">
                    {/* Track Info */}
                    <div
                        className="flex flex-row items-center bg-[#0d0d0d] w-[30%] whitespace-nowrap overflow-hidden text-ellipsis hover:bg-background-secondary-hover rounded-xl p-2"
                        onClick={() => setIsOpen(true)}>
                        <Cover
                            className="min-w-[60px] h-[60px] rounded-xl overflow-hidden bg-white bg-opacity-19 shadow-[0_0_5px_3px_rgba(44,44,44,0.2)]"
                            placeholder={<ImagePlaceholder size="medium"/>}
                            src={getCMImageUrl(currentSong.cover?.id, "120x120")}
                            size="60x60"
                            imageSize="200x200"
                        />
                        <div className="flex flex-col mx-2.5 justify-center text-white font-medium overflow-hidden">
                            {currentSong.title ? (
                                <div className="flex flex-row items-center gap-1.5">
                                    <div className="text-lg truncate">{currentSong.title}</div>
                                </div>
                            ) : (
                                <Skeleton
                                    variant="rounded"
                                    sx={{bgcolor: "#ffffff1f"}}
                                    animation={false}
                                    width={50}
                                    height={10}
                                />
                            )}
                            {currentSong.artists.length !== 0 ? (
                                <div className="flex flex-row gap-1.5 ml-0.5">
                  <span
                      onClick={(e) => e.stopPropagation()}
                      className="truncate"
                  >
                    {currentSong.artists.map((artist) => (
                        <ArtistName size="15px" artist={artist} key={artist.id}/>
                    ))}
                  </span>
                                </div>
                            ) : (
                                <Skeleton
                                    variant="rounded"
                                    sx={{bgcolor: "#ffffff1f", marginTop: "5px"}}
                                    animation={false}
                                    width={100}
                                    height={10}
                                />
                            )}
                        </div>
                        <div className="flex items-center justify-center ml-auto">
                            <div
                                className="flex justify-center items-center w-[50px] border-r border-r-gray-100 border-opacity-10 h-full">
                                <LikeButton track={currentSong}/>
                            </div>
                        </div>
                    </div>

                    {/* Primary Controls */}
                    <div className="flex flex-col justify-center flex-grow">
                        <Box className="flex flex-row justify-center items-center">
                            <IconButton
                                className={`p-0 mx-1 ${playerState.shuffle ? "!text-black/80 bg-white rounded-md" : "text-white"}`}
                                onClick={handleShuffle}
                                aria-label="shuffle"
                            >
                                <Shuffle/>
                            </IconButton>
                            <IconButton
                                onClick={skipBack}
                                className="p-0 mx-1 !text-white"
                                aria-label="previous song"
                            >
                                <FastRewindRounded/>
                            </IconButton>
                            <IconButton
                                className="p-0 mx-1 !text-white [&>svg]:!text-[40px]"
                                key={`player-button-play-${playerState.playing}`}
                                aria-label={playerState.playing ? "play" : "pause"}
                                onClick={playerState.playing ? stopPlayerFunc : startPlayerFunc}
                            >
                                {playerState.playing ? <PauseRounded/> : <PlayArrowRounded/>}
                            </IconButton>
                            <IconButton
                                onClick={skipForward}
                                className="p-0 mx-1 !text-white"
                                aria-label="next song"
                            >
                                <FastForwardRounded/>
                            </IconButton>
                            <IconButton
                                className={`p-0 mx-1 ${playerState.repeat ? "!text-black/80 bg-white rounded-md" : "text-white"}`}
                                onClick={handleRepeat}
                                aria-label="repeat"
                            >
                                <Repeat/>
                            </IconButton>
                        </Box>
                        <div className="flex flex-row items-center gap-2.5">
                            <div className="text-white text-xs font-normal min-w-[30px] text-center">
                                {secToMinutesAndSeconds(position)}
                            </div>
                            <SeekSlider
                                loadingState={playerState.loading}
                                position={position}
                                duration={duration}
                                changeTime={seekTo}
                            />
                            <div className="text-white text-xs font-normal min-w-[30px] text-center">
                                {secToMinutesAndSeconds(duration)}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Controls */}
                    <div className="flex items-center w-[30%] pr-10">
                        <div className="flex flex-row items-center justify-center w-[150px] text-white gap-2.5 ml-auto">
                            <VolumeIcon/>
                            <Slider
                                size="small"
                                value={volume}
                                max={100}
                                step={1}
                                onChange={handleVolumeChange}
                                className="w-full"
                                sx={{
                                    color: "#fff",
                                    height: 4,
                                    "& .MuiSlider-track": {border: "none"},
                                    "& .MuiSlider-thumb": {
                                        "&::before": {boxShadow: "none"},
                                        "&:hover, &.Mui-focusVisible, &.Mui-active": {
                                            boxShadow: "none",
                                        },
                                    },
                                }}
                                aria-label="Volume"
                                valueLabelDisplay="auto"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="fixed flex justify-center items-center left-0 top-0 w-[100dvw] h-[100dvh] z-10 bg-black bg-opacity-50"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Main Player Container */}
                    <div
                        className="flex max-h-[700px] flex-row gap-5 p-5 rounded-2xl overflow-hidden bg-white bg-opacity-15 shadow-[0_0_5px_3px_rgba(44,44,44,0.2)] px-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left Section - Track Info and Controls */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col justify-center items-center w-[400px] gap-5 px-2">
                                <div
                                    className="flex justify-center items-center w-full h-[384px] relative overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSong.id}
                                            className="w-[384px] h-[384px] rounded-xl overflow-hidden bg-white/20 cursor-pointer relative"
                                            initial={{opacity: 0, scale: 0.95, x: 150}}
                                            animate={{
                                                opacity: 1,
                                                scale: playerState.playing ? 1 : 0.95,
                                                x: 0,
                                                transition: {
                                                    scale: {ease: "easeInOut", duration: 0.2},
                                                    ease: "easeIn"
                                                }
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: -150,
                                                scale: 0.95,
                                                transition: {
                                                    duration: 0.2
                                                }
                                            }}
                                            transition={{
                                                ease: "easeIn"
                                            }}
                                            onClick={playerState.playing ? stopPlayerFunc : startPlayerFunc}
                                        >
                                            {(playerState.loading || !playerState.playing) && (
                                                <div
                                                    className="absolute inset-0 flex items-center text-white justify-center z-[10] rounded-xl">
                                                    {playerState.loading ? (
                                                        <Loader size={60} height={60}/>
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0 flex items-center bg-black/30 text-white justify-center z-[10] rounded-xl">
                                                            <PauseRounded style={{fontSize: "60px"}}/>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <motion.div
                                                initial={{scale: 1.1}}
                                                animate={{scale: 1}}
                                                transition={{
                                                    ease: "easeIn",
                                                }}
                                            >
                                                <Cover
                                                    placeholder={<ImagePlaceholder size="large"/>}
                                                    src={getCMImageUrl(currentSong.cover?.id, "800x800")}
                                                    size="800x800"
                                                    unWrapped
                                                />
                                            </motion.div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Track Info */}
                                <div className="flex flex-row justify-start items-center w-full px-5">
                                    <div className="flex flex-col text-white font-medium overflow-hidden flex-grow">
                                        {currentSong.title ? (
                                            <div className="flex flex-row items-center gap-1.5">
                                                <div className="text-xl truncate">
                                                    {currentSong.title}
                                                </div>
                                            </div>
                                        ) : (
                                            <Skeleton
                                                variant="rounded"
                                                sx={{bgcolor: "#ffffff1f"}}
                                                animation={false}
                                                width={150}
                                                height={15}
                                            />
                                        )}
                                        {currentSong.artists.length !== 0 ? (
                                            <div className="flex flex-row gap-1.5 ml-0.5">
                        <span
                            onClick={(e) => e.stopPropagation()}
                            className="truncate"
                        >
                          {currentSong.artists.map((artist) => (
                              <ArtistName
                                  key={artist.id}
                                  size="15px"
                                  artist={artist}
                              />
                          ))}
                        </span>
                                            </div>
                                        ) : (
                                            <Skeleton
                                                variant="rounded"
                                                sx={{bgcolor: "#ffffff1f", marginTop: "5px"}}
                                                animation={false}
                                                width={200}
                                                height={15}
                                            />
                                        )}
                                    </div>
                                    <div
                                        className="flex items-center ml-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <LikeButton silent track={currentSong}/>
                                    </div>
                                </div>

                                {/* Seek Bar */}
                                <div
                                    className="flex flex-col w-full px-5"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <SeekSlider
                                        loadingState={playerState.loading}
                                        position={position}
                                        duration={duration}
                                        changeTime={seekTo}
                                    />
                                    <div className="flex justify-between items-center w-full mt-2.5">
                                        <div className="text-white text-xs font-normal">
                                            {secToMinutesAndSeconds(position)}
                                        </div>
                                        <div className="text-white text-xs font-normal">
                                            {secToMinutesAndSeconds(duration)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Player Controls */}
                            <div className="flex justify-center items-center my-5">
                                <Box
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex flex-row justify-center items-center"
                                >
                                    <div
                                        className={`p-0 mx-1 text-white cursor-pointer ${playerState.shuffle ? "!text-black/80 bg-white rounded-md overflow-hidden" : ""}`}
                                        onClick={() => setPlayerShuffle(!playerState.shuffle)}
                                    >
                                        <Shuffle/>
                                    </div>
                                    <IconButton
                                        onClick={skipBack}
                                        className="p-0 mx-1 !text-white text-[2.5rem]"
                                        aria-label="previous song"
                                    >
                                        <FastRewindRounded/>
                                    </IconButton>
                                    <PlayButton
                                        className="mx-1"
                                        playing={playerState.playing}
                                        startFunc={startPlayerFunc}
                                        stopFunc={stopPlayerFunc}
                                        onKeyDown={(e: Event) => e.preventDefault()}
                                    />
                                    <IconButton
                                        onClick={skipForward}
                                        className="p-0 mx-1 !text-white text-[2.5rem]"
                                        aria-label="next song"
                                    >
                                        <FastForwardRounded/>
                                    </IconButton>
                                    <div
                                        className={`p-0 mx-1 text-white cursor-pointer ${playerState.repeat ? "!text-black/80 bg-white rounded-md overflow-hidden" : ""}`}
                                        onClick={() => setPlayerRepeat(!playerState.repeat)}
                                    >
                                        <Repeat/>
                                    </div>
                                </Box>
                            </div>


                            {/* Volume Control */}
                            <div
                                className="flex justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-row items-center justify-center w-[180px] text-white gap-2.5">
                                    <VolumeIcon/>
                                    <Slider
                                        size="small"
                                        value={volume}
                                        max={100}
                                        step={1}
                                        onChange={handleVolumeChange}
                                        className="w-full"
                                        sx={{
                                            color: "#fff",
                                            height: 4,
                                            "& .MuiSlider-track": {border: "none"},
                                            "& .MuiSlider-thumb": {
                                                "&::before": {boxShadow: "none"},
                                                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                                                    boxShadow: "none",
                                                },
                                            },
                                        }}
                                        aria-label="Volume"
                                        valueLabelDisplay="auto"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Queue */}
                        <div
                            className="flex flex-col justify-start w-[400px] h-auto overflow-x-hidden overflow-y-scroll"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                className="flex flex-col gap-2.5 pr-2.5"
                                initial="hidden"
                                animate="visible"
                            >
                                {renderQueue}
                            </motion.div>
                        </div>
                    </div>

                    {/* Background Image */}
                    <div className="absolute left-0 top-0 w-full h-full z-[-1]">
                        <div
                            className="absolute backdrop-blur-[200px] bg-black bg-opacity-40 left-0 top-0 w-full h-full"></div>
                        <img
                            className="w-full h-full object-cover"
                            src={getCMImageUrl(currentSong.cover?.id, "50x50")}
                            alt="Album background"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}
        </>
    );
});