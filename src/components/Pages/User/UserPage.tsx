import axios from "axios";
import React, {useEffect, useState} from "react";
import PopUpModal from "../../PopUpModal";
import DevLog from "../../DevLog";
import { RootState, useAppDispatch, useAppSelector } from "../../../store";
import { setUser } from "./userSlice";
import { UserT } from "./user.types";
import AuthCard from "./AuthCard/AuthCard";

const link = process.env.REACT_APP_YMAPI_LINK
const token = localStorage.getItem("Authorization")
const [localUserId, localAccessToken] = token ? token.split(":") : []
const User = () => {
    const dispatch = useAppDispatch()
    const [userId, setUserId] = useState<string>(localUserId)
    const [accessToken, setAccessToken] = useState<string>(localAccessToken)
    const [devlogActive, setDevLogActive] = useState(false)
    const setCurrentUser = (user:UserT) => dispatch(setUser(user))
    const currentUser = useAppSelector((state:RootState)=> state.user)
    const [isYandexLoading, setIsYandexLoading] = useState(false)

    const fetchUser = async () => {
        setIsYandexLoading(true)
        try {
            const response = await axios.get(
                `${link}/ya/user`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setCurrentUser(response.data)
            setIsYandexLoading(false)
        } catch (err) {
            console.error('Ошибка при получении списка треков:', err);
        }
    };

    useEffect(() => {
        localStorage.setItem("Authorization", userId + ":" + accessToken)
        fetchUser()
    }, [userId, accessToken])
    
    return (
        <div className="page-default animated-opacity" style={{color:"white"}}>
            <div>
                <div>USER ID:</div>
                <input value={userId} onChange={(e) => {
                    setUserId(e.target.value)
                }} />
            </div>
            <div>
                <div>ACCESS TOKEN:</div>
                <input value={accessToken} onChange={(e) => {
                    setAccessToken(e.target.value)
                }} />
            </div>
            <button onClick={() => { setDevLogActive(!devlogActive) }} />
            <PopUpModal active={devlogActive} setActive={setDevLogActive}>
                <DevLog />
            </PopUpModal>
            <AuthCard status={isYandexLoading ? "loading" : currentUser.user ? "success" : "failed"} user={currentUser.user} service="YandexMusic"/>
        </div>
    )
}

export default User