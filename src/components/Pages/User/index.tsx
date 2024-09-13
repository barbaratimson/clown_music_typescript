import axios from "axios";
import React, {useEffect, useState} from "react";
import PopUpModal from "../../PopUpModal";
import DevLog from "../../DevLog";
import { RootState, useAppDispatch, useAppSelector } from "../../../store";
import { setUser } from "./userSlice";
import { UserT } from "./user.types";
import AuthCard from "./AuthCard/AuthCard";
import AuthModal from "./AuthModal/AuthModal";

const link = process.env.REACT_APP_YMAPI_LINK
const User = () => {
    const dispatch = useAppDispatch()
    const token = localStorage.getItem("Authorization")
    const [localUserId, localAccessToken] = token ? token.split(":") : []
    const [userId, setUserId] = useState<string>(localUserId)
    const [accessToken, setAccessToken] = useState<string>(localAccessToken)
    const [devlogActive, setDevLogActive] = useState(false)
    const setCurrentUser = (user:UserT) => dispatch(setUser(user))
    const currentUser = useAppSelector((state:RootState)=> state.user)
    const [isYandexLoading, setIsYandexLoading] = useState(false)
    const [modalActive, setModalActive] = useState(false)

    const fetchUser = async () => {
        setIsYandexLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/user`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setCurrentUser(response.data)
            console.log(response.data)
            setIsYandexLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    useEffect(() => {
        localStorage.setItem("Authorization", currentUser.user.account?.uid + ":" + accessToken)
        fetchUser()
    }, [accessToken])

    useEffect(() => {
        localStorage.setItem("Authorization", currentUser.user.account?.uid + ":" + accessToken)
    }, [currentUser,accessToken])

    
    return (
        <>
        <div className="page-default animated-opacity" style={{color:"white"}}>
            <AuthCard onClick={()=>{setModalActive(true)}} status={isYandexLoading ? "loading" : currentUser.user ? "success" : "failed"} user={currentUser.user} service="YandexMusic"/>
            <button className="button" onClick={() => { setDevLogActive(!devlogActive) }}  >Dev log</button>
        </div>
            <PopUpModal active={devlogActive} setActive={setDevLogActive}>
                <DevLog />
            </PopUpModal>
            <AuthModal active={modalActive} setActive={setModalActive} data={accessToken} setData={setAccessToken} user={currentUser.user}/>
        </>
    )
}

export default User