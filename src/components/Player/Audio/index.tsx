import React, {forwardRef} from "react";
import {TrackT} from "../../../utils/types/types";

interface AudioPropsT {
    track: TrackT,
    onTimeUpdate?: (e:any)=>void,
    onLoadStart?: (e:any)=>void,
    onEnded?: (e:any)=>void,
    onError?: (e:any)=>void,
    onCanPlay?: (e:any)=>void,
    onPause?: (e:any)=>void,
    onPlay?: (e:any)=>void,
    onPlaying?:(e:any)=>void,
    onProgress?:(e:any)=>void,
    onLoadedMetadata?: (e:any)=>void,
    preload: string | undefined,
    crossOrigin: "anonymous" | "use-credentials" | "" | undefined
    src?: string,
}

const Audio = forwardRef<HTMLAudioElement, AudioPropsT>((props, ref) => {
    return (
        <audio
            src={props.src}
            ref={ref}
            preload={props.preload}
            crossOrigin={props.crossOrigin}
            style={{display: "none"}}
            onTimeUpdate={props.onTimeUpdate}
            onLoadedMetadata={props.onLoadedMetadata}
            onEnded={props.onEnded}
            onPlay={props.onPlay}
            onPlaying={props.onPlaying}
            onPause={props.onPause}
            onProgress={props.onProgress}
        />
)
})

export default Audio