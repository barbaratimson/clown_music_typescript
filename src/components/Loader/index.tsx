import React from "react";
import {CircularProgress} from "@mui/material";
import './style.scss'

interface LoaderTypeExtensions {
    PageLoader?: typeof PageLoader
}

interface LoaderProps {
    size?:number
    height?: number
}

const Loader = ({size,height}:LoaderProps & LoaderTypeExtensions) => {

    return (
        <div className="loader-wrapper" style={{height: height + "px"}}>
            <CircularProgress size={size} className="loader" />
        </div>
    )
}

const PageLoader = ({size}:LoaderProps) => {

    return (
        <div className="loader-wrapper page">
            <CircularProgress size={size} className="loader" />
        </div>
    )
}
Loader.PageLoader = PageLoader

export default Loader