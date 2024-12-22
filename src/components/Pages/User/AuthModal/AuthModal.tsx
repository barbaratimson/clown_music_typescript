import PopUpModal from "../../../UI/PopUpModal";
import React from "react";
import {UserT} from "../user.types";
import './style.scss'
import {ExpandMore} from "@mui/icons-material";

interface AuthModalPropsT {
    active: boolean,
    setActive: any
    data:any
    setData: (data:any) => void
    user: UserT
}

const AuthModal = ({active,setActive,data,setData,user}:AuthModalPropsT) => {
    return (
        <PopUpModal active={active} setActive={setActive}>
            <div className="auth-modal__wrapper">
                <div className="auth-modal__close" ><ExpandMore /></div>
                <div className="auth-modal__text">{user.account?.displayName}</div>
                <div className="auth-modal__text">Access token:</div>
                <input className="auth-modal__input"
                    // type={"password"}
                    value={data} onClick={(e)=>{e.stopPropagation()}}
                    onChange={(e) => {
                    setData(e.target.value)
                }} />
            </div>
        </PopUpModal>
    )
}

export default AuthModal