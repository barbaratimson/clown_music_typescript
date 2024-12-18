import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../../Loader";
import Album from "./Album";
import {AlbumT} from "../../../utils/types/types";
import {fetchAlbum} from "../../../utils/apiRequests";

const link = process.env.REACT_APP_YMAPI_LINK
const AlbumView = () => {
    const {albumId} = useParams()
    const [album,setAlbum] = useState<AlbumT>()
    const [isLoading,setIsLoading] = useState(true)



    useEffect(() => {
        setIsLoading(true)
        fetchAlbum(albumId).then(result => setAlbum(result)).finally(() => setIsLoading(false))
    }, [albumId]);


    if (isLoading) return <Loader.PageLoader/>
    return (
        <>
            {album ? (
                <Album album={album}/>
            ) : null}
        </>
    )
}

export default AlbumView