import React from 'react';
import {IconButton} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {
    const path = useLocation()
    return (
        <div className="nav-wrapper-mobile">
        <div className="navbar-mobile">
            <div className="button-wrapper-nav-mobile">
                <Link className={`${path.pathname === "/home" ? "navLink-active" : ""}`} to={"/home"}><IconButton className="navbar-button"><HomeIcon/></IconButton></Link>
                <Link className={`${path.pathname === "/collection" ? "navLink-active" : ""}`} to={"/collection"}><IconButton className="navbar-button"><LibraryBooksIcon/></IconButton></Link>
                <Link className={`${path.pathname === "/chart" ? "navLink-active" : ""}`} to={"/chart"}><IconButton className="navbar-button"><TrendingUpIcon/></IconButton></Link>
                <Link className={`${path.pathname === "/user" ? "navLink-active" : ""}`} to={"/user"}><IconButton className="navbar-button"><PersonIcon/></IconButton></Link>
                {/*<Link className={`${path.pathname === "/settings" ? "navLink-active" : ""}`} to={"/settings"}><IconButton className="navbar-button"><SettingsIcon/></IconButton></Link>*/}
            </div>
        </div>
        </div>
    );

};
    export default Navbar;


