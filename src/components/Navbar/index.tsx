    import React, { useEffect,useRef,useState } from 'react';
import Player from "../Player";
import {Box, Button, Container, IconButton} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home'
    import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
    import TrendingUpIcon from '@mui/icons-material/TrendingUp';
    import SettingsIcon from '@mui/icons-material/Settings';
    import PersonIcon from '@mui/icons-material/Person';
    import SearchIcon from '@mui/icons-material/Search';
    import {Link} from "react-router-dom";

const Navbar = () => {
    const changePage = (e:any) => {

    }
    return (
        <div className="navbar">
            <div className="button-wrapper-nav">
                <Link to={"/home"}><IconButton className="navbar-button"><HomeIcon/></IconButton></Link>
                <Link to={"/collection"}><IconButton className="navbar-button"><LibraryBooksIcon/></IconButton></Link>
                <Link to={"/chart"}><IconButton className="navbar-button"><TrendingUpIcon/></IconButton></Link>
                <Link to={"/search"}><IconButton className="navbar-button"><SearchIcon/></IconButton></Link>
            </div>
            <div className="button-wrapper-user">
                <Link to={"/user"}><IconButton className="navbar-button"><PersonIcon/></IconButton></Link>
                <Link to={"/settings"}><IconButton className="navbar-button"><SettingsIcon/></IconButton></Link>
            </div>
        </div>
    );

};
    export default Navbar;


