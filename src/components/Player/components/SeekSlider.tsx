import Slider from "@mui/material/Slider";
import {LinearProgress} from "@mui/material";
import React from "react";

interface SeekSliderProps {
    loadingState: boolean,
    position: number,
    duration:number,
    changeTime: Function
}

const SeekSlider = ({loadingState,position,duration,changeTime}:SeekSliderProps)=>{
    return (
        <>
            {!loadingState ? (
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
                    '& .MuiLinearProgress-bar1': {
                        display: "none"
                    },
                    '& .MuiLinearProgress-root': {
                        
                    }
                }} className="player-loader"/>
            )}
        </>
    )
}

export default SeekSlider
