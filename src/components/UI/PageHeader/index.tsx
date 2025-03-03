 import {forwardRef} from "react"
import Cover from "../Cover"
import {getIsMobileInfo} from "../../../utils/deviceHandler"
 import {getImageLink} from "../../../utils/utils";
 import {getCMImageUrl} from "../../../utils/cmApiRequsts";

interface PageHeaderT {
    titleText: string,
    descText?: string,
    src?: string
    controls?: any
    children?: any
    ref?: any
}


const PageHeader = forwardRef<HTMLDivElement, PageHeaderT>((props, ref) => {
    const mobile = getIsMobileInfo()
    return (
        <div ref={ref} className="page-header-wrapper">
            <div className="page-header-image-wrapper">
                <Cover src={props.src} placeholder={<div className="page-header-image-placeholder"></div>}
                       unWrapped size={mobile ? "600x600" : "1000x1000"}/>
            </div>
            <div className="page-header-info">
                <div className="page-header-info-title">{props.titleText}</div>
                <div className="page-header-info-desc">{props.descText}</div>
                {props.children}
            </div>
            <div className="page-header-info-controls">
                {props.controls}
            </div>
        </div>
    )
})

export default PageHeader