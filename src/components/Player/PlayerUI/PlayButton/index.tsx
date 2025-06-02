import { IconButton } from "@mui/material";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";

interface PlayButtonProps {
  playing: boolean,
  startFunc: () => void,
  stopFunc: () => void,
  onKeyDown: (e: any) => void;
  className?: string
}

const PlayButton = ({ playing, startFunc, stopFunc, onKeyDown, className }: PlayButtonProps) => {
  return (
    <IconButton
      className={`!text-white !p-0 px-1 transition-all [&>svg]:!text-[50px] duration-400 ease-in ${className}`}
      key={`player-button-play-${playing}`}
      aria-label={playing ? 'play' : 'pause'}
      onClick={() => {
        !playing ? startFunc() : stopFunc()
      }}
      onKeyDown={(e) => {
        onKeyDown(e)
      }}
    >
      {!playing ? (
        <PlayArrowRounded/>
      ) : (
        <PauseRounded/>
      )}
    </IconButton>
  )
}

export default PlayButton