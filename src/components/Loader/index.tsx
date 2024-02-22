
import React from "react";
import {CircularProgress} from "@mui/material";


const Loader = () => {

    return (
        <div className="loader-wrapper">
            <CircularProgress className="loader" />
        </div>
    )
}

export default Loader