interface PageBlockProps {
    title: string,
    children?: any,
    controls?: any
    key?: React.Key
}


const PageBlock = ({title, children, controls}: PageBlockProps) => {
    return (
        <div className="page-block-wrapper">
            <div className="page-block-header">
                <div className="page-block-title">{title}</div>
                <div className="page-block-controls">{controls}</div>
            </div>
            <div className="page-block-contents">
                {children}
            </div>
        </div>
    )
}

export default PageBlock