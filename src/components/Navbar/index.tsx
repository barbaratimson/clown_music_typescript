import React, { useEffect,useRef,useState } from 'react';
import Player from "../Player";
import {Box, Button, Container, IconButton} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {

    return (
            <div className="navbar">
                <div className="button-wrapper">
                    <IconButton className="navbar-button"><HomeIcon/></IconButton>
                    <Button>SsS</Button>
                    <Button>SsS</Button>
                    <Button>SsS</Button>
                </div>
            </div>
    );

    };

    export default Navbar;


