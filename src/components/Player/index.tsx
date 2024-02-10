import React, { useEffect,useRef,useState } from 'react';
import {SongT} from "../../utils/types/types";

interface PlayerProps  {
    playerState: "loading" | "playing" | "error",
    playPause: Function
    currentSong: SongT

}

const Player = () =>{
    return (
       <>
           <audio preload={"auto"}  crossOrigin="anonymous"
                  src={"https://s17sas.storage.yandex.net/get-mp3/b952fbc52786e693fc971d00ab3253dc/0006110542826d46/rmusic/U2FsdGVkX182lP0JIY74yyPh1TVo1BLFQBApC6OGLJhj2xvvqPmcOxJCZAVbK_AeTmYIIG_wqqIpUtujshLNq-tvVPKmOAfYy8uihb0A8HQ/772a79286de4cf383cdd541712b23a955c4ba8761dbc7b66703fb328c269a29e"}
                 ></audio>
       </>
    )
}

export default Player;


