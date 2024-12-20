import React, {useEffect} from "react";
import "./ContextMenu.scss"
import {ClickAwayListener, Fade, Popper} from "@mui/material";

interface ContextMenuProps {
    children: React.ReactElement
    anchorEl: HTMLElement | null
    active: boolean
    setActive: (state: boolean) => void
    keepMounted?: boolean
    position?: 'auto-end' | 'auto-start' | 'auto' | 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top'
}


const ContextMenu = ({children, anchorEl, active, setActive, keepMounted, position}: ContextMenuProps) => {

    return (
        <>
            {active && <div className="context-menu__click-away_wrapper" onClick={() => {
                setActive(false)
            }}></div>}
            <Popper disablePortal placement={position} open={active} anchorEl={anchorEl} keepMounted={keepMounted}>
                <div className="context-menu__wrapper">
                    {children}
                </div>
            </Popper>
        </>
    )
}


export default ContextMenu
