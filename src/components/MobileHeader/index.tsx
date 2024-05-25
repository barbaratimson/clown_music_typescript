import {Link, useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {IconButton} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {ArrowBackIosNew} from "@mui/icons-material";


const MobileHeader = () => {
    const path = useLocation()
    const navigate = useNavigate()
    return (
        <div className="header-wrapper-mobile">
            <div className="header-mobile">
                <div className="button-wrapper-header-mobile">
                    <IconButton onClick={()=>{navigate(-1)}} className="navbar-button"><ArrowBackIosNew/></IconButton>
                    <Link className={`${path.pathname === "/search" ? "navLink-active" : ""}`} to={"/search"}><IconButton className="navbar-button"><SearchIcon/></IconButton></Link>
                </div>
            </div>
        </div>
    )
}

export default MobileHeader