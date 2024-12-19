import "./Button.scss"
import React, {forwardRef} from "react";
interface ButtonT {
    className?: string
    children?: any
    onClick?: (e:any) => void
}

const Button = forwardRef<HTMLDivElement,ButtonT>((props, ref) => {
    return (
        <div className={`button__wrapper ${props.className}`} onClick={props.onClick} >
            {props.children}
        </div>
    )
})

export default Button