import React, {MouseEventHandler, useEffect} from "react";
import "./ContextMenu.scss"
import {ClickAwayListener, Fade, Popper} from "@mui/material";
import {Add, ContentCopy} from "@mui/icons-material";
import Loader from "../Loader";

interface ContextMenuProps {
    children: React.ReactElement
    anchorEl: HTMLElement | null
    active: boolean
    setActive: (state: boolean) => void
    keepMounted?: boolean
    clickAway?: boolean
    position?: 'auto-end' | 'auto-start' | 'auto' | 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top'
}


export const ContextMenu = ({
                                children,
                                anchorEl,
                                active,
                                setActive,
                                keepMounted,
                                position,
                                clickAway
                            }: ContextMenuProps) => {

    return (
        <>
            {clickAway && active && <div className="context-menu__click-away_wrapper" onClick={() => {
                setActive(false)
            }}></div>}
            <Popper placement={position} open={active} anchorEl={anchorEl} disablePortal modifiers={[{
                name: 'flip',
                enabled: false,
            },
                {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        altAxis: true,
                        altBoundary: false,
                        tether: true,
                        rootBoundary: 'document',
                    }
                }]} keepMounted={keepMounted}>
                <div className="context-menu__wrapper">
                    {children}
                </div>
            </Popper>
        </>
    )
}


interface ContextMenuElementProps {
    label: string,
    icon: React.ReactElement
    onClick: (e: any) => void
    additional?: React.ReactElement
}

export const ContextMenuElement = ({label, icon, onClick, additional}: ContextMenuElementProps) => {
    return (
        <div className="context-menu__button" onClick={onClick}>
            <div className="context-menu__button__icon">
                {icon}
            </div>
            <div className="context-menu__button__label">
                {label}
            </div>
            {additional && <div className="context-menu__button__label additional">
                    {additional}
            </div>}
        </div>
    )
}


