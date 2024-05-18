import Player from "../Player";
import React, {useEffect} from "react";
import Navbar from "../Navbar";
import {Route, Routes, useNavigate} from "react-router-dom";
import Collection from "./pages/Collection";
import Chart from "./pages/Chart";
import Home from "./pages/Home";
import Search from "./pages/Search";
import User from "./pages/User";
import Settings from "./pages/Settings";
import Playlist from "../Playlist";
import PlaylistView from "../PlaylistView";
import Artist from "./pages/Artist";
import AlbumView from "../AlbumView";


const Page = () => {
    return (
        <div className="page-wrapper">
            <Routes>
                <Route path="collection" element={<Collection/>} />
                <Route path="chart" element={<Chart/>} />
                <Route path="home" element={<Home/>} />
                <Route path="/" element={<RedirectToHome/>} />
                <Route path="search" element={<Search/>} />
                <Route path="user" element={<User/>} />
                <Route path="settings" element={<Settings/>} />
                <Route path="users/:userId/playlist/:playlistId" element={<PlaylistView />} />
                <Route path="artist/:artistId" element={<Artist/>}></Route>
                <Route path="artist/:artistId/album/:albumId" element={<AlbumView/>}></Route>
                <Route path = '*' element = {<div>Страница не найдена</div>} />
            </Routes>
        </div>
    )
}

const RedirectToHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/home");
    }, []);

    return (
       <></>
    )
}

export default Page