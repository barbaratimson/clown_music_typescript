import Player from "../Player";
import React from "react";
import Navbar from "../Navbar";
import Page from "../Pages";
import Message from "../Message";
import {useAppDispatch} from "../../store";
import {setMessageActive} from "../../store/ErrorMessageSlice";


const Main = () => {
    return (
            <div className="main-wrapper">
                <Navbar/>
                <Page />
                <Player/>
                <Message/>
            </div>
    )
}

export default Main