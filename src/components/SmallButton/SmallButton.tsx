import "./SmallButton.scss"
interface ButtonT {
    onClick: () => void
    className?: string
    children?: any
}

const SmallButton = ({className, onClick, children}:ButtonT) => {
    return (
        <div onClick={onClick} className={`smallButton__wrapper ${className}`}>
            {children}
        </div>
    )
}

export default SmallButton