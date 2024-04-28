import React, {useEffect} from "react";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {Fade, Modal} from "@mui/material";
import {hideMessage, showMessage} from "../../store/MessageSlice";


const Message = () => {
    const dispatch = useAppDispatch()
    const message = useAppSelector((state:RootState)=> state.message.message)
    const hideMessageFunc = () => dispatch(hideMessage())

    useEffect(() => {
        const a = setTimeout(()=>{
            hideMessageFunc()
        },2000)
        return ()=>{clearInterval(a)}
    }, [message.active]);

    return (
        <Fade in={message.active}>
                    <div className="error-message-wrapper">
                        <div>{message.message}</div>
                    </div>
        </Fade>
    )
}

export default Message