import React from 'react';
import HomeIcon from '@mui/icons-material/Home'
import {Link, useLocation} from "react-router-dom";
import Button from "../UI/Button/Button";
import "./Navbar.scss"
import {LibraryMusic} from "@mui/icons-material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import NavButton from "./NavButton/NavButton";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar__buttons_wrapper">
                <NavButton title="Home" to="/home"><HomeIcon/></NavButton>
                <NavButton title="Your collection" to="/collection"><LibraryMusic/></NavButton>
                <NavButton title="Music chart" to="/chart"><TrendingUpIcon/></NavButton>
                <NavButton title="Search" to="/search"><SearchIcon/></NavButton>
            </div>
            <div className="navbar__buttons_wrapper_bottom">
                <NavButton title="Your info" to="/user"><PersonIcon/></NavButton>
            </div>
        </div>
    );

};

export default Navbar;


