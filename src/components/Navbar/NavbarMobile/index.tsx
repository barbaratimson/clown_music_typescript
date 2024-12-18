import React from 'react';
import {IconButton} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import {Link, useLocation} from "react-router-dom";
import {LibraryMusic} from "@mui/icons-material";
import "../Navbar.scss"
import NavButton from '../NavButton/NavButton';

const Navbar = () => {
    const path = useLocation()
    return (
        <div className="nav-wrapper-mobile">
        <div className="navbar-mobile">
            <div className="button-wrapper-nav-mobile">
                <NavButton title="Home" to="/home"><HomeIcon/></NavButton>
                <NavButton title="Your collection" to="/collection"><LibraryMusic/></NavButton>
                <NavButton title="Music chart" to="/chart"><TrendingUpIcon/></NavButton>
                <NavButton title="Your info" to="/user"><PersonIcon/></NavButton>
            </div>
        </div>
        </div>
    );

};
    export default Navbar;


