import React, {useEffect} from "react";
import {RootState, useAppDispatch, useAppSelector} from "../../store";
import {Fade, Modal} from "@mui/material";
import {setMessageActive} from "../../store/ErrorMessageSlice";


const Message = () => {
    const dispatch = useAppDispatch()
    const errorMessage = useAppSelector((state:RootState)=> state.errorMessage.errorMessage)
    const setErrMessageActive = (active:boolean) => dispatch(setMessageActive(active))
    const handleClose = () => setErrMessageActive(false)

    useEffect(() => {
        const a = setTimeout(()=>{
            setErrMessageActive(false)
        },2000)
        return ()=>{clearInterval(a)}
    }, [errorMessage.active]);

    return (
        <Fade in={errorMessage.active}>
                    <div className="error-message-wrapper">
                        <div>{errorMessage.message}</div>
                    </div>
        </Fade>
    )
}

export default Message