import Player from "../Player";
import React from "react";
import Navbar from "../Navbar";
import Page from "../Pages";


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