import { forwardRef } from "react"
import Track from "../Track/Track"
import TrackCover from "../TrackCover"

interface PageHeaderT {
    titleText: string,
    descText: string,
    coverUri?: string
    controls?: any
    ref?: any
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderT>((props,ref) => {
    return (
        <div ref={ref} className="page-header-wrapper">
            <div className="page-header-image-wrapper">
                <TrackCover coverUri={props.coverUri} placeholder={null} unWrapped size="600x600" />
            </div>
            <div className="page-header-info">
                <div className="page-header-info-title">{props.titleText}</div>
                <div className="page-header-info-desc">{props.descText}</div>
            </div>
            <div className="page-header-info-controls">
                {props.controls}
            </div>
        </div>
    )
})

export default PageHeader