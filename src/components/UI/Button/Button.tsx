import "./Button.scss"
import React, {forwardRef} from "react";
interface ButtonT {
    className?: string
    children?: any
    onClick?: (e:any) => void
    style?: any
}

const Button = forwardRef<HTMLDivElement,ButtonT>((props, ref) => {
    return (
        <div style={props.style} className={`button__wrapper ${props.className}`} onClick={props.onClick} >
            {props.children}
        </div>
    )
})

export default Button