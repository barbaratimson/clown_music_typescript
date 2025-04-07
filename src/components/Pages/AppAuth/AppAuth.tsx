import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import "./AppAuth.scss"
import {fetchCmUser} from "../../../utils/cmApiRequsts";
import {TrackId} from "../../../utils/types/types";
import {setLikedSongs} from "../../../store/LikedSongsSlice";
import {UserT} from "../User/user.types";
import {setUser} from "../User/userSlice";
import {useAppDispatch, useAppSelector} from "../../../store";
import Loader from "../../UI/Loader";
import {Input} from "../../UI/Input/Input";
import {Auth} from "./Auth/Auth";

interface AppAuthProps {
    changeLoadingState: React.Dispatch<React.SetStateAction<boolean>>
}
export const AppAuth = ({changeLoadingState} : AppAuthProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useAppDispatch()
    const setLikedSongsData = (songs: Array<TrackId>) => (dispatch(setLikedSongs(songs)))
    const setCurrentUser = (user: UserT) => dispatch(setUser(user))
    const currentUser = useAppSelector(state => state.user.user)

    useEffect(() => {
        setIsLoading(true)
        Promise.all([
        // fetchLikedSongs().then(data => setLikedSongsData(data)),
        fetchCmUser().then(data => setCurrentUser(data))
        ]).then(()=>{setIsLoading(false)})
    }, []);

    useEffect(() => {
        if (currentUser) {
            changeLoadingState(isLoading)
        }
    }, [isLoading]);

    return (
        <div className="app-auth">
            {isLoading && currentUser ? (
                <div>
                    <div className="logo">CLOWN MUSIC</div>
                    <Loader/>
                </div>
            ): <Auth/>}
        </div>
    );
};

