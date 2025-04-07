import {Input} from "../UI/Input/Input";
import "./UploadForms.scss"
import {SubmitHandler, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {FileInput} from "../UI/FileInput/FileInput";
import axios from "axios";
import {ArtistT, TrackT, TrackType} from "../../utils/types/types";
import Artist from "../Pages/pages/Artist";
import ArtistName from "../ArtistName";
import Button from "../UI/Button/Button";
import SongsList from "../SongsList";
import {cmLink, fetchCmArtists, fetchCmUserTracks, getCMImageUrl} from "../../utils/cmApiRequsts";
import {trackArrayWrap} from "../../utils/trackWrap";
import artist from "../Pages/pages/Artist";
import Cover from "../UI/Cover";
import Searchbar from "../UI/Searchbar/Searchbar";

interface PlaylistFormInput {
    name: string
    imageFile: FileList
}

export const PlaylistCreateForm = () => {
    const {register, handleSubmit} = useForm<PlaylistFormInput>();
    const onSubmit: SubmitHandler<ArtistUploadFormInput> = (data) => createCmPlaylist(data)
    const createCmPlaylist = async (artistFormData: ArtistUploadFormInput) => {
        const requestForm = new FormData()
        requestForm.append("name", artistFormData.name)
        if (artistFormData.imageFile) {
            requestForm.append("imageFile", artistFormData.imageFile[0])
        }
        try {
            const response = await axios.post(
                `${cmLink}/playlist`, requestForm, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
            return response.data
        } catch (err: any) {
            // setMessage(err.message,"error")
            // devLog("error while fetching song link "+ err.code + err.message);
            console.log("Error while getting download link: " + err)
        }
    };


    return (
        <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="upload-form-text">Playlist</div>
            <div className="upload-form-top">
                <div className="upload-form-inputs">
                    <Input register={register("name", {required: true, maxLength: 50})} placeholder="Playlist title"/>
                </div>
                <FileInput fileType="image" register={register("imageFile")}/>
            </div>
            <input className="upload-form-button-send" type="submit"/>
        </form>
    );
};

interface ArtistUploadFormInput {
    name: string
    imageFile: FileList
}

export const ArtistUploadForm = () => {
    const {register, handleSubmit} = useForm<ArtistUploadFormInput>();
    const onSubmit: SubmitHandler<ArtistUploadFormInput> = (data) => createCmArtist(data)
    const createCmArtist = async (artistFormData: ArtistUploadFormInput) => {
        const requestForm = new FormData()
        requestForm.append("name", artistFormData.name)
        if (artistFormData.imageFile) {
            requestForm.append("imageFile", artistFormData.imageFile[0])
        }
        try {
            const response = await axios.post(
                `${cmLink}/artist`, requestForm, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
            return response.data
        } catch (err: any) {
            // setMessage(err.message,"error")
            // devLog("error while fetching song link "+ err.code + err.message);
            console.log("Error while getting download link: " + err)
        }
    };


    return (
        <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="upload-form-top">
                <div className="upload-form-inputs">
                    <Input register={register("name", {required: true, maxLength: 50})} placeholder="Artist name"/>
                </div>
                <FileInput fileType="image" register={register("imageFile")}/>
            </div>
            <input className="upload-form-button-send" type="submit"/>
        </form>
    );
};


interface TrackUploadFormInput {
    title: string
    genre: string
    imageFile: FileList
    audioFile: FileList
}

export const TrackUploadForm = () => {
    const {register, handleSubmit} = useForm<TrackUploadFormInput>();
    const [selectableArtists, setSelectableArtists] = useState<ArtistT[]>([])
    const [selectedArtists, setSelectedArtists] = useState<ArtistT[]>([])
    const [userTracks, setUserTracks] = useState<TrackT[]>([])
    const onSubmit: SubmitHandler<TrackUploadFormInput> = (data) => uploadCmTrack(data)
    const uploadCmTrack = async (trackFromData: TrackUploadFormInput) => {
        const requestForm = new FormData()
        requestForm.append("title", trackFromData.title)
        requestForm.append("artists", JSON.stringify(selectedArtists))
        requestForm.append("genre", trackFromData.genre)
        if (trackFromData.imageFile) {
            requestForm.append("imageFile", trackFromData.imageFile[0])
        }
        if (trackFromData.audioFile) {
            requestForm.append("audioFile", trackFromData.audioFile[0])
        }
        try {
            const response = await axios.post(
                `${cmLink}/track`, requestForm, {headers: {"Authorization": localStorage.getItem("Authorization_CM")}});
            return response.data
        } catch (err: any) {
            // setMessage(err.message,"error")
            // devLog("error while fetching song link "+ err.code + err.message);
            console.log("Error while getting download link: " + err)
        }
    };

    const addArtist = (artist: ArtistT) => {
        if (selectedArtists.indexOf(artist) === -1 && selectedArtists.length <= 10) {
            setSelectedArtists([...selectedArtists, artist])
        }
    }


    useEffect(() => {
        fetchCmArtists()
            .then(data => setSelectableArtists(data))
    }, []);

    return (
        <>
            <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="upload-form-top">
                    <FileInput fileType="image" register={register("imageFile")}/>
                    <div className="upload-form-inputs">
                        <Input register={register("title", {required: true, maxLength: 50})} placeholder="Track Title"/>
                        {/*TODO: Replace with selection*/}
                        {/*    <select>*/}
                        {/*        <option>a</option>*/}
                        {/*    </select>*/}
                        <Input register={register("genre", {required: true, maxLength: 50})} placeholder="Track Genre"/>
                        <div className="upload-form-text">Artists</div>
                        <div className="artist-upload-wrapper">
                            {selectableArtists?.map(artist => (
                                <Button onClick={() => {
                                    addArtist(artist)
                                }} style={{width: "fit-content"}}>{artist.name}</Button>
                            ))}
                        </div>
                        <div className="upload-form-text">Selected artists</div>
                        <div className="artist-upload-wrapper">
                            {selectedArtists?.map(artist => (
                                <Button onClick={() => {
                                    setSelectedArtists(selectedArtists.filter(elem => elem.id !== artist.id))
                                }} style={{width: "fit-content"}}>{artist.name}</Button>
                            ))}
                        </div>
                    </div>
                </div>
                <FileInput fileType="audio" register={register("audioFile")}/>
                <input className="upload-form-button-send" type="submit"/>
            </form>
        </>
    )
}
