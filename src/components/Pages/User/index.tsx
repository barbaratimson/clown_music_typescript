import axios from "axios";
import React, {useEffect, useState} from "react";
import PopUpModal from "../../PopUpModal";
import DevLog from "../../DevLog";
import { RootState, useAppDispatch, useAppSelector } from "../../../store";
import { setUser } from "./userSlice";
import { UserT } from "./user.types";
import AuthCard from "./AuthCard/AuthCard";
import AuthModal from "./AuthModal/AuthModal";
import Slider from "@mui/material/Slider";

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
    const [mobileVolume, setMobileVolume] = useState(Number(localStorage.getItem("mobilePlayer_volume")) ?? 1)

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
        localStorage.setItem("mobilePlayer_volume",(mobileVolume).toString())
    }, [mobileVolume]);

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

            <PopUpModal active={devlogActive} setActive={setDevLogActive}>
                <DevLog />
            </PopUpModal>
            <AuthModal active={modalActive} setActive={setModalActive} data={accessToken} setData={setAccessToken} user={currentUser.user}/>
            <div>
                <div className="home-page-">MobileVolume</div>
                <Slider size="small"
                        value={mobileVolume}
                        max={1}
                        step={0.01}
                        onChange={(_, value) => setMobileVolume(value as number)}
                        className="player-seek"
                        sx={{
                            color: '#fff',
                            height: 4,
                            '& .MuiSlider-track': {
                                border: 'none',
                            },
                            '& .MuiSlider-thumb': {
                                '&::before': {
                                    boxShadow: 'none',
                                },
                                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                    boxShadow: 'none',
                                },
                            }}}
                        aria-label="Default" valueLabelDisplay="auto"/>
            </div>
            </div>
        </>
    )
}

export default User