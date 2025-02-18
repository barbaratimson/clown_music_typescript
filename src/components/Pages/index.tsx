import React, {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Collection from "./pages/Collection";
import Chart from "./pages/Chart";
import Home from "./Home/Home";
import Search from "./Search/Search";
import User from "./User";
import Settings from "./pages/Settings";
import PlaylistView from "./PlaylistView";
import Artist from "./pages/Artist";
import AlbumView from "./AlbumView";

interface PagePropsT {
    isMobile:boolean
}
const Page = ({isMobile}:PagePropsT) => {
    return (
        <div className={`page-wrapper ${isMobile && "mobile"}`}>
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
                <Route path = '*' element = {<div style={{color:"white"}}>Страница не найдена</div>} />
            </Routes>
        </div>
    )
}

const RedirectToHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/home");
    });

    return (
       <></>
    )
}

export default Page