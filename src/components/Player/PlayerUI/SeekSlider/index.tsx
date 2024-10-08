import Slider from "@mui/material/Slider";
import {LinearProgress} from "@mui/material";
import React from "react";

interface SeekSliderProps {
    loadingState: boolean,
    position: number,
    duration:number,
    changeTime: (value:number)=>void,
}

const SeekSlider = ({loadingState,position,duration,changeTime}:SeekSliderProps)=>{
    return (
        <>
            {!loadingState? (
                <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={position}
                    min={0}
                    step={1}
                    max={duration}
                    onChange={(_, value) => changeTime(value as number)}
                    className="player-seek"
                    sx={{
                        color: '#fff',
                        height: 4,
                        '& .MuiSlider-thumb': {
                            display: "none",
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.28,
                        },
                    }}
                    valueLabelDisplay="auto"/>
            ) : (
                <LinearProgress sx={{
                    color: '#fff',
                    height:4,
                    backgroundColor: 'rgb(255,255,255, 0.28) !important',
                    '& .MuiLinearProgress-bar1': {
                        display: "none"
                    },
                }} className="player-loader"/>
            )}
        </>
    )
}

export default SeekSlider
