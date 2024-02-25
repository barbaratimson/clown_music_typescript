import {Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, {useEffect, useState} from "react";

const link = "http://localhost:5051"
const token = localStorage.getItem("Authorization")
const [localUserId, localAccessToken] = token ? token.split(":") : []
const User = () => {
    const [userId, setUserId] = useState<string>(localUserId)
    const [accessToken, setAccessToken] = useState<string>(localAccessToken)
    const [userData, setUserData] = useState<any>()
    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${link}/ya/user`, {headers: {"Authorization": localStorage.getItem("Authorization")}});
            console.log(response.data)
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
        <>
            <Typography>{userData?.account?.displayName}</Typography>
            <TextField id="outlined-basic" label="User ID" value={userId} onChange={(e) => {
                setUserId(e.target.value)
            }} variant="outlined"/>
            <TextField id="outlined-basic" label="Token" value={accessToken} onChange={(e) => {
                setAccessToken(e.target.value)
            }} variant="outlined"/>
        </>
    )
}

export default User