import SongsList from "../../SongsList";
import React, {useEffect, useState} from "react";
import {ArtistUploadForm, PlaylistCreateForm, TrackUploadForm} from "../../UploadForms/UploadForms";
import {TrackT} from "../../../utils/types/types";
import {fetchCmUser, fetchCmUserTracks} from "../../../utils/cmApiRequsts";
import {playlistFromTracksArr} from "../../../utils/utils";
import {useAppSelector} from "../../../store";

export const Upload = () => {

    const user = useAppSelector(state => state.user.user)
    const [uploadedTracks, setUploadedTracks] = useState<TrackT[]>([])

    useEffect(() => {
            fetchCmUserTracks(user.id).then(data => setUploadedTracks(data))
    }, [user]);
    return (
        <div className="page-default animated-opacity-4ms">
            <PlaylistCreateForm/>
            <TrackUploadForm/>
            <ArtistUploadForm/>
            {uploadedTracks &&
                <SongsList playlist={playlistFromTracksArr(uploadedTracks,"Uploaded tracks")} tracks={uploadedTracks}></SongsList>
            }
        </div>
    );
};