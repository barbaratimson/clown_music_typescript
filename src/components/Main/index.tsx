import Player from "../Player";
import React from "react";
import Navbar from "../Navbar";
import Page from "../Pages";


const Main = () => {

    //TODO: Fully rewrite pager system to be based on anchors
    //TODO: Fix Player bugs
    //TODO: Change components structure

    return (
            <div className="main-wrapper">
                <Navbar/>
                <Page />
                <Player/>
            </div>
    )
}

export default Main