import React, {ReactElement, useEffect} from "react";
import {Slide} from "@mui/material";
import {useLocation} from 'react-router-dom'
import './style.scss'

interface PopUpModalProps {
    children:ReactElement,
    active: boolean,
    setActive: any,
    unmount?:boolean
}

const PopUpModal = ({children,active,setActive,unmount}:PopUpModalProps) => {

    return (
        <>
            <Slide direction={"up"} in={active} unmountOnExit={unmount}>
                    <div className="track-info-mobile" onClick={()=>{setActive(false)   }}>
                        {children}
                    </div>
            </Slide>
        </>
    )
}

export default PopUpModal
