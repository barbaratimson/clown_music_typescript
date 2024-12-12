import SearchIcon from "@mui/icons-material/Search";
import React, {forwardRef} from "react";
import "./Searchbar.scss"

interface SearchT {
    value:string,
    setValue:(value:string)=>void
    className?:string
}

const Searchbar = forwardRef<HTMLInputElement,SearchT>((props,ref) => {
    return (
        <div className={"searchbar " + props.className}>
            <div className="searchbar__search_icon"><SearchIcon /></div>
            <input autoFocus ref={ref} value={props.value} className="searchbar__search_input" type='text'
                   onChange={(e) => {
                       props.setValue(e.target.value)
                   }} />
        </div>
    )
})

export default Searchbar