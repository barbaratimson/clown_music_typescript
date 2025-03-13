import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import "./AppAuth.scss"
import {fetchLikedSongs} from "../../../utils/apiRequests";
import {fetchCmUser} from "../../../utils/cmApiRequsts";
import {TrackId} from "../../../utils/types/types";
import {setLikedSongs} from "../../../store/LikedSongsSlice";
import {UserT} from "../User/user.types";
import {setUser} from "../User/userSlice";
import {useAppDispatch} from "../../../store";
import Loader from "../../UI/Loader";
import {Input} from "../../UI/Input/Input";

interface AppAuthProps {
    changeLoadingState: React.Dispatch<React.SetStateAction<boolean>>
}
export const AppAuth = ({changeLoadingState} : AppAuthProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useAppDispatch()
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setCurrentUser = (user: UserT) => dispatch(setUser(user))

    useEffect(() => {
        setIsLoading(true)
        Promise.all([
        fetchLikedSongs().then(data => setLikedSongsData(data)),
        fetchCmUser().then(data => setCurrentUser(data))
        ]).then(()=>{setIsLoading(false)})
    }, []);

    useEffect(() => {
        changeLoadingState(isLoading)
    }, [isLoading]);

    return (
        <div className="app-auth">
            {isLoading || true ? (
                <div>
                    <div className="logo">CLOWN MUSIC</div>
                    <Loader/>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};


const Auth = () => {
    return (
        <div>
            <div></div>
            {/*<Input register={}></Input>*/}
        </div>
    )
}
