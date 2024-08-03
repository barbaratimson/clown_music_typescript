import { getImageLink } from "../../utils/utils"

export type CoverSizeT = "50x50" | "100x100" | "200x200" | "300x300" | "400x400" | "500x500" | "600x600" | "700x700"| "800x800" | "900x900" | "1000x1000"

interface TrackCoverProps {
    coverUri: string,
    size: CoverSizeT
    imageSize: CoverSizeT
}

const TrackCover = ({coverUri,size,imageSize}:TrackCoverProps) => {
    const [width, height] = size.split("x")
    return (
        <div style={{minWidth:width+"px",height:height+"px"}} className="cover-wrapper">
                <img style={{minWidth:width+"px",height:height+"px"}} src={getImageLink(coverUri, imageSize)} loading="lazy" alt=""/>
        </div>
    )
}

export default TrackCover