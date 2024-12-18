import {useNavigate} from "react-router-dom";
import React from "react";
import {Fade} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {ArrowBackIosNew} from "@mui/icons-material";
import {RootState, useAppSelector} from "../../store";
import Cover from "../Cover";
import NavButton from "../Navbar/NavButton/NavButton";
import Button from "../Button/Button";


const MobileHeader = () => {
    const navigate = useNavigate()
    const headerInfo = useAppSelector((state:RootState) => state.header.header)
        return (
        <div className="header-wrapper-mobile">
            <div className={`header-mobile ${headerInfo.active ? "dim" : null}`}>
                <div className="button-wrapper-header-mobile">
                    <Button onClick={()=>{navigate(-1)}}><ArrowBackIosNew sx={{fontSize:"20px"}}/></Button>
                    <Fade in={headerInfo.active}>
                        <div className="header-mobile-title-wrapper">
                            {headerInfo.imgUrl && <Cover coverUri={headerInfo.imgUrl} size="25x25" imageSize="50x50"/>}
                            <div className="header-mobile-title">{headerInfo.title}</div>
                        </div>
                        </Fade>
                    <NavButton title="Serach" to="/search"><SearchIcon/></NavButton>
                </div>
            </div>
        </div>
    )
}

interface headerTitleProps {
    title: string,
    imgUrl: string,
    linkTo: string
}


export default MobileHeader