import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import { LibraryMusic, Upload, TrendingUp, Search, Person } from '@mui/icons-material';
import NavButton from "./NavButton/NavButton";

const Navbar = () => {
    return (
        <div className="
            flex flex-col
            bg-bg-color-main
            rounded-tr-[16px]
            fixed h-full
            p-[10px] pb-[98px] px-[10px]
        ">
            <div className="
                flex flex-col
                justify-center items-center
                gap-5
            ">
                <NavButton title="Home" to="/home"><HomeIcon/></NavButton>
                <NavButton title="Your collection" to="/collection"><LibraryMusic/></NavButton>
                <NavButton title="Music chart" to="/chart"><TrendingUp/></NavButton>
                <NavButton title="Search" to="/search"><Search/></NavButton>
            </div>
            <div className="
                flex flex-col
                justify-end items-center
                flex-grow
                gap-5
            ">
                <NavButton title="Upload" to="/upload"><Upload/></NavButton>
                <NavButton title="Your info" to="/user"><Person/></NavButton>
            </div>
        </div>
    );
};

export default Navbar;