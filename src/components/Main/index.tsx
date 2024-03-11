import Player from "../Player";
import React from "react";
import Navbar from "../Navbar";
import Page from "../Pages";
import {useMediaSession} from "@mebtte/react-media-session";
import {getImageLink} from "../../utils/utils";
import {RootState, useAppSelector} from "../../store";


const Main = () => {

    return (
            <div className="main-wrapper">
                <Navbar/>
                <Page />
                <Player/>
            </div>
    )
}

export default Main