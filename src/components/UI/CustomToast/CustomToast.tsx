import {ToastContentProps} from "react-toastify";
import {Favorite, HeartBroken} from "@mui/icons-material";
import Cover from "../Cover";
import {getCMImageUrl} from "../../../utils/cmApiRequsts";
import ArtistName from "../../ArtistName";
import React from "react";
import { TrackT } from "../../../utils/types/types";
import "../../Message/style.scss";

export const CustomToast = ({ closeToast, data }: ToastContentProps & {data:{msg:string, description?: string}}) => {
    return (
        <div className="flex flex-col gap-2.5" onClick={closeToast}>
            <p className="text-[18px] text-white font-semibold">{data.msg}</p>
            {data.description && <p className="text-[16px] text-white/80 font-semibold">{data.description}</p>}
        </div>
    )
}

export const CustomTrackToast = ({ closeToast, data }: ToastContentProps & {data:{track: TrackT, type:"trackLiked" | "trackRemoved"}}) => {
    return (
      <div className="flex flex-row gap-[2px] relative overflow-hidden">
          <div className="message-cover-animation">
              <div className={`message-cover-animation-icon`}>{data.type === "trackLiked" ? <Favorite /> : <HeartBroken />}</div>
              <Cover src={getCMImageUrl(data.track.cover?.id,"50x50")} size={"50x50"} imageSize="50x50" />
          </div>
          <div
              className="flex flex-col mx-2.5 justify-center text-white text-sm font-medium tracking-wider overflow-hidden whitespace-nowrap">
              <div className="flex">
                  <div className="text-ellipsis overflow-hidden">
                      {data.track.title + `${data.track.version ? ` (${data.track.version})` : ""}`}
                  </div>
              </div>
              <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-row gap-1"
              >
                        <span className="text-ellipsis overflow-hidden">
                            {data.track.artists.map(artist => (
                                <ArtistName key={artist.id} artist={artist}/>
                            ))}
                        </span>
              </div>
          </div>
      </div>
    )
}