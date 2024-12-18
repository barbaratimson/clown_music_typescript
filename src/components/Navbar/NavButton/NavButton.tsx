import React from "react";
import {Link, useLocation} from "react-router-dom";
import Button from "../../Button/Button";
import "./NavButton.scss"

interface NavButtonProps {
    to: string,
    children: React.ReactElement,
    title?:string
}

const NavButton = ({to,children,title}:NavButtonProps) => {
    const path = useLocation()
    return (
        <div className="navbar__button">
        <Link title={title} to={to}><Button className={`navbar-button ${path.pathname === to ? " navbar__link_active" : ""}`}>{children}</Button></Link>
    </div>
)


}

export default NavButton