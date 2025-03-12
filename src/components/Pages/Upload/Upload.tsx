import SongsList from "../../SongsList";
import React, {useEffect, useState} from "react";
import {ArtistUploadForm, TrackUploadForm} from "../../UploadForms/UploadForms";
import {TrackT} from "../../../utils/types/types";
import {fetchCmUser, fetchCmUserTracks} from "../../../utils/cmApiRequsts";

export const Upload = () => {
    const [uploadedTracks, setUploadedTracks] = useState<TrackT[]>([])

    useEffect(() => {
        fetchCmUserTracks().then(data => setUploadedTracks(data))
    }, []);
    return (
        <div className="page-default">
            <TrackUploadForm/>
            <ArtistUploadForm/>
            {uploadedTracks &&
                <SongsList tracks={uploadedTracks}></SongsList>
            }
        </div>
    );
};