import "./Button.scss"
interface ButtonT {
    className?: string
    children?: any
    onClick?: () => void
}

const Button = ({className, onClick, children   }:ButtonT) => {
    return (
        <div className={`button__wrapper ${className}`} onClick={onClick} >
            {children}
        </div>
    )
}

export default Button