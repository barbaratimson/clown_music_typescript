import React, {ReactElement, useEffect} from "react";
import {Fade, Slide} from "@mui/material";
import {useLocation} from 'react-router-dom'
import './style.scss'

export interface PopUpModalProps {
    children:ReactElement,
    active: boolean,
    setActive: any,
    unmount?:boolean
}

const PopUpModal = ({children,active,setActive,unmount}:PopUpModalProps) => {

    return (
        <>
            <Fade in={active}>
                <div className={"modal-wrapper"} onClick={()=>{setActive(false)}}></div>
            </Fade>
            <Slide direction={"up"} in={active}>
                    <div className="popup-modal" onClick={()=>{setActive(false)}}>
                        {children}
                    </div>
            </Slide>
        </>
    )
}

export default PopUpModal
