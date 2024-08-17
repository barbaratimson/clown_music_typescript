import { forwardRef } from "react"
import Track from "../Track/Track"
import TrackCover from "../TrackCover"
import { getIsMobileInfo } from "../../utils/deviceHandler"

interface PageHeaderT {
    titleText: string,
    descText?: string,
    coverUri?: string
    controls?: any
    info?:any
    ref?: any
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderT>((props,ref) => {
    const mobile = getIsMobileInfo()
    return (
        <div ref={ref} className="page-header-wrapper">
            <div className="page-header-image-wrapper">
                <TrackCover coverUri={props.coverUri} placeholder={null} unWrapped size={mobile ? "600x600" : "1000x1000"} />
            </div>
            <div className="page-header-info">
                <div className="page-header-info-title">{props.titleText}</div>
                <div className="page-header-info-desc">{props.descText}</div>
                {props.info}
            </div>
            <div className="page-header-info-controls">
                {props.controls}
            </div>
        </div>
    )
})

export default PageHeader