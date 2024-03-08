import Player from "../Player";
import React from "react";
import Navbar from "../Navbar";
import {Route, Routes} from "react-router-dom";
import Collection from "./pages/Collection";
import Chart from "./pages/Chart";
import Home from "./pages/Home";
import Search from "./pages/Search";
import User from "./pages/User";
import Settings from "./pages/Settings";
import Playlist from "../Playlist";


const Page = () => {

    return (
        <div className="page-wrapper">
            <Routes>
                <Route path="collection" element={<Collection/>} />
                <Route path="chart" element={<Chart/>} />
                <Route path="home" element={<Home/>} />
                <Route path="search" element={<Search/>} />
                <Route path="user" element={<User/>} />
                <Route path="settings" element={<Settings/>} />
                {/*<Route path="playlist/:playlistId" element={<Playlist/>} />*/}
                <Route path = '*' element = {<div>Страница не найдена</div>} />
            </Routes>
        </div>
    )
}

export default Page