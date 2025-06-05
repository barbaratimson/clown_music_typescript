import { Input } from "../UI/Input/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { FileInput } from "../UI/FileInput/FileInput";
import axios from "axios";
import { ArtistT, TrackT } from "../../utils/types/types";
import ArtistName from "../ArtistName";
import Button from "../UI/Button/Button";
import {cmLink, fetchCmArtists, getCMImageUrl} from "../../utils/cmApiRequsts";
import Search from "../Pages/Search/Search";
import Searchbar from "../UI/Searchbar/Searchbar";
import Cover from "../UI/Cover";
import {Upload} from "@mui/icons-material";

interface PlaylistFormInput {
    name: string
    imageFile: FileList
}

export const PlaylistCreateForm = () => {
    const { register, handleSubmit } = useForm<PlaylistFormInput>();
    const onSubmit: SubmitHandler<PlaylistFormInput> = (data) => createCmPlaylist(data);

    const createCmPlaylist = async (artistFormData: PlaylistFormInput) => {
        const requestForm = new FormData();
        requestForm.append("name", artistFormData.name);
        if (artistFormData.imageFile) {
            requestForm.append("imageFile", artistFormData.imageFile[0]);
        }
        try {
            const response = await axios.post(
                `${cmLink}/playlist`,
                requestForm,
                { headers: { "Authorization": localStorage.getItem("Authorization_CM") } }
            );
            return response.data;
        } catch (err: any) {
            console.log("Error while getting download link: " + err);
        }
    };

    return (
        <form
            className="flex flex-col w-full gap-2.5 bg-background-secondary p-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="text-base text-font-color-main font-semibold">Playlist</div>
            <div className="flex flex-row justify-between gap-5">
                <div className="flex flex-col flex-grow gap-2.5">
                    <Input
                        register={register("name", { required: true, maxLength: 50 })}
                        placeholder="Playlist title"
                    />
                </div>
                <FileInput fileType="image" register={register("imageFile")} />
            </div>
            <input
                className="upload-form-button-send"
                type="submit"
            />
        </form>
    );
};

interface ArtistUploadFormInput {
    name: string
    imageFile: FileList
}

export const ArtistUploadForm = () => {
    const { register, handleSubmit } = useForm<ArtistUploadFormInput>();
    const onSubmit: SubmitHandler<ArtistUploadFormInput> = (data) => createCmArtist(data);

    const createCmArtist = async (artistFormData: ArtistUploadFormInput) => {
        const requestForm = new FormData();
        requestForm.append("name", artistFormData.name);
        if (artistFormData.imageFile) {
            requestForm.append("imageFile", artistFormData.imageFile[0]);
        }
        try {
            const response = await axios.post(
                `${cmLink}/artist`,
                requestForm,
                { headers: { "Authorization": localStorage.getItem("Authorization_CM") } }
            );
            return response.data;
        } catch (err: any) {
            console.log("Error while getting download link: " + err);
        }
    };

    return (
        <form
            className="flex flex-col w-full gap-2.5 bg-background-secondary p-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-row justify-between gap-5">
                <div className="flex flex-col flex-grow gap-2.5">
                    <Input
                        register={register("name", { required: true, maxLength: 50 })}
                        placeholder="Artist name"
                    />
                </div>
                <FileInput fileType="image" register={register("imageFile")} />
            </div>
            <input className="upload-form-button-send" type="submit" />
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
    const { register, handleSubmit } = useForm<TrackUploadFormInput>();
    const [selectableArtists, setSelectableArtists] = useState<ArtistT[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<ArtistT[]>([]);
    const [artistsToShow, setArtistsToShow] = useState<ArtistT[]>()
    const onSubmit: SubmitHandler<TrackUploadFormInput> = (data) => uploadCmTrack(data);
    const [search, setSearch] = useState<string>("")
    const uploadCmTrack = async (trackFromData: TrackUploadFormInput) => {
        const requestForm = new FormData();
        requestForm.append("title", trackFromData.title);
        requestForm.append("artists", JSON.stringify(selectedArtists));
        requestForm.append("genre", trackFromData.genre);
        if (trackFromData.imageFile) {
            requestForm.append("imageFile", trackFromData.imageFile[0]);
        }
        if (trackFromData.audioFile) {
            requestForm.append("audioFile", trackFromData.audioFile[0]);
        }
        try {
            const response = await axios.post(
                `${cmLink}/track`,
                requestForm,
                { headers: { "Authorization": localStorage.getItem("Authorization_CM") } }
            );
            return response.data;
        } catch (err: any) {
            console.log("Error while getting download link: " + err);
        }
    };

    const handleSearch = (value: string) => {
        setArtistsToShow(selectableArtists.filter(e => e.name.toLowerCase().includes(value.toLowerCase())));
    }

    const addArtist = (artist: ArtistT) => {
        if (selectedArtists.indexOf(artist) === -1 && selectedArtists.length <= 10) {
            setSelectedArtists([...selectedArtists, artist]);
        }
    };

    useEffect(() => {
        fetchCmArtists()
            .then(data => setSelectableArtists(data));
    }, []);


    useEffect(() => {
        if (search) {
        handleSearch(search)
        } else {
            setSearch("")
        }
    }, [search]);

    return (
        <form
            className="flex flex-col w-full gap-2.5 bg-background-secondary p-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-row justify-between gap-5">
                <FileInput fileType="image" register={register("imageFile")} />
                <div className="flex flex-col flex-grow gap-2.5">
                    <Input
                        register={register("title", { required: true, maxLength: 50 })}
                        placeholder="Track Title"
                    />
                    <Input
                        register={register("genre", { required: true, maxLength: 50 })}
                        placeholder="Track Genre"
                    />
                    <div className="text-base text-font-color-main font-semibold text-white">Artists</div>
                    <Searchbar value={search} setValue={(e) => setSearch(e)}></Searchbar>
                    <div className="flex flex-row flex-wrap gap-2">
                        {search && artistsToShow?.splice(0,10)?.map(artist => (
                            <Button
                                key={artist.id}
                                className="flex gap-2"
                                onClick={(e) => {addArtist(artist);e.preventDefault()}}
                                style={{ width: "fit-content" }}
                            >
                                <Cover src={getCMImageUrl(
                                    artist.cover?.id,
                                    "50x50",
                                )} size="50x50"></Cover>
                                {artist.name}
                            </Button>
                        ))}
                    </div>
                    <div className="text-base text-font-color-main font-semibold text-white">Selected artists</div>
                    <div className="flex flex-row flex-wrap gap-2">
                        {selectedArtists?.map(artist => (
                            <Button
                                key={artist.id}
                                className="flex gap-2"
                                onClick={(e) => {setSelectedArtists(selectedArtists.filter(elem => elem.id !== artist.id))}}
                                style={{ width: "fit-content" }}
                            >
                                <Cover src={getCMImageUrl(
                                    artist.cover?.id,
                                    "50x50",
                                )} size="50x50"></Cover>
                                {artist.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <FileInput fileType="audio" register={register("audioFile")} />
            <button className="upload-form-button-send bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 mt-5" type="submit"><Upload/></button>
        </form>
    );
};