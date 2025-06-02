import { Input } from "../UI/Input/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { FileInput } from "../UI/FileInput/FileInput";
import axios from "axios";
import { ArtistT, TrackT } from "../../utils/types/types";
import ArtistName from "../ArtistName";
import Button from "../UI/Button/Button";
import { cmLink, fetchCmArtists } from "../../utils/cmApiRequsts";

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

    const onSubmit: SubmitHandler<TrackUploadFormInput> = (data) => uploadCmTrack(data);

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

    const addArtist = (artist: ArtistT) => {
        if (selectedArtists.indexOf(artist) === -1 && selectedArtists.length <= 10) {
            setSelectedArtists([...selectedArtists, artist]);
        }
    };

    useEffect(() => {
        fetchCmArtists()
            .then(data => setSelectableArtists(data));
    }, []);

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
                    <div className="text-base text-font-color-main font-semibold">Artists</div>
                    <div className="flex flex-row flex-wrap gap-2">
                        {selectableArtists?.map(artist => (
                            <Button
                                key={artist.id}
                                onClick={(e) => {addArtist(artist);e.preventDefault()}}
                                style={{ width: "fit-content" }}
                            >
                                {artist.name}
                            </Button>
                        ))}
                    </div>
                    <div className="text-base text-font-color-main font-semibold">Selected artists</div>
                    <div className="flex flex-row flex-wrap gap-2">
                        {selectedArtists?.map(artist => (
                            <Button
                                key={artist.id}
                                onClick={() => {
                                    setSelectedArtists(selectedArtists.filter(elem => elem.id !== artist.id));
                                }}
                                style={{ width: "fit-content" }}
                            >
                                {artist.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <FileInput fileType="audio" register={register("audioFile")} />
            <input className="upload-form-button-send" type="submit" />
        </form>
    );
};