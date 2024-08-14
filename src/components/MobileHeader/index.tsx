import {Link, useLocation, useNavigate} from "react-router-dom";
import React from "react";
import {Fade, IconButton} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {ArrowBackIosNew} from "@mui/icons-material";
import {RootState, useAppDispatch, useAppSelector} from "../../store";


const MobileHeader = () => {
    const path = useLocation()
    const navigate = useNavigate()
    const headerInfo = useAppSelector((state:RootState) => state.header.header)
        return (
        <div className="header-wrapper-mobile">
            <div className={`header-mobile ${headerInfo.active ? "dim" : null}`}>
                <div className="button-wrapper-header-mobile">
                    <IconButton onClick={()=>{navigate(-1)}} className="navbar-button"><ArrowBackIosNew/></IconButton>
                    <Fade unmountOnExit in={headerInfo.active}>
                            <div className="header-mobile-title">{headerInfo.title}</div>
                        </Fade>
                    <Link className={`${path.pathname === "/search" ? "navLink-active" : ""}`} to={"/search"}><IconButton className="navbar-button"><SearchIcon/></IconButton></Link>
                </div>
            </div>
        </div>
    )
}

export default MobileHeader