import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import PopUpModal from "../../PopUpModal";
import DevLog from "../../DevLog";

const link = process.env.REACT_APP_YMAPI_LINK
const token = localStorage.getItem("Authorization")
const [localUserId, localAccessToken] = token ? token.split(":") : []
const User = () => {
    const [userId, setUserId] = useState<string>(localUserId)
    const [accessToken, setAccessToken] = useState<string>(localAccessToken)
    const [userData, setUserData] = useState<any>()
    const [devlogActive, setDevLogActive] = useState(false)
    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/user`, { headers: { "Authorization": localStorage.getItem("Authorization") } });
            setUserData(response.data)
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
            <div>{userData?.account?.displayName}</div>
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
            {/*<TextField id="outlined-basic" label="User ID" value={userId} onChange={(e) => {*/}
            {/*    setUserId(e.target.value)*/}
            {/*}} variant="outlined"/>*/}
            {/*<TextField id="outlined-basic" label="Token" value={accessToken} onChange={(e) => {*/}
            {/*    setAccessToken(e.target.value)*/}
            {/*}} variant="outlined"/>*/}
        </div>
    )
}

export default User