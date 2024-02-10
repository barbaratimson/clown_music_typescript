import Player from "../Player";
import React from "react";
import Navbar from "../Navbar";
import {Container} from "@mui/material";


const Main = () => {

    //TODO: Fully rewrite pager system to be based on anchors
    //TODO: Fix Player bugs
    //TODO: Change components structure

    return (
            <div className="main-wrapper">
                <Navbar/>
                <Player/>
            </div>
    )
}

export default Main