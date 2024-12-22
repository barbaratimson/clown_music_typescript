import {memo} from "react"
import {getImageLink} from "../../../utils/utils"
import './style.scss'
import {MusicNote} from "@mui/icons-material"

export type CoverSizeT = "50x50" | "100x100" | "150x150" | "200x200" | "300x300" | "400x400" | "500x500" | "600x600" | "700x700" | "800x800" | "900x900" | "1000x1000"

interface CoverProps {
    coverUri: string | undefined,
    size: string
    imageSize?: CoverSizeT
    unWrapped?: boolean
    placeholder?: any
    className?: string
}

const Cover = memo(({ coverUri, size, imageSize, unWrapped,placeholder, className}: CoverProps) => {
    const [width, height] = size.split("x")
    const link = getImageLink(coverUri, imageSize ?? size)

    if (!unWrapped) {
        if (!link) return (
        <div style={{ minWidth: width + "px", height: height + "px" }} className={`cover-wrapper ${className}`}>
                {placeholder ?? <ImagePlaceholder/>}
        </div>
        )
        return (
            <div style={{ minWidth: width + "px", height: height + "px" }} className={`cover-wrapper ${className}`}>
                <img style={{ minWidth: width + "px", height: height + "px"}} src={link} loading="lazy" alt="" />
            </div>
        )
    } else {
        if (!link) return placeholder ?? <ImagePlaceholder/>
        return (
                <img className={className} src={getImageLink(coverUri, imageSize ?? size)} loading="lazy" alt="" />
        )
    }
})

interface ImagePlaceholderProps {
    size?: 'inherit' | 'large' | 'medium' | 'small'
    children?: any
}



export const ImagePlaceholder = ({size,children}:ImagePlaceholderProps) =>{
    return (
        <div className="image-placeholder">
            {children ?? <MusicNote fontSize={size ?? "large"}/>}
            </div>
    )
}

export default Cover