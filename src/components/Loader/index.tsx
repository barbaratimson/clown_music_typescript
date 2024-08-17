
import React from "react";
import {CircularProgress} from "@mui/material";

interface LoaderProps {
    size?:number
}

const Loader = ({size}:LoaderProps) => {

    return (
        <div className="loader-wrapper">
            <CircularProgress size={size} className="loader" />
        </div>
    )
}

export const PageLoader = ({size}:LoaderProps) => {

    return (
        <div className="page-loader-wrapper">
            <CircularProgress size={size} className="loader" />
        </div>
    )
}

export default Loader