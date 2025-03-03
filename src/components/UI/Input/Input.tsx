import React from "react";
import "./Input.scss"
import {UseFormRegister, UseFormRegisterReturn} from "react-hook-form";
interface InputProps {
    type?: "number" | "text" | "password"
    placeholder?: string
    register: UseFormRegisterReturn<any>,
    className?: string
}

export const Input = ({type,register, placeholder, className}:InputProps) => {
    return (
        <input className={`input ${className}`}
               {...register}
               type={type ?? "text"}
               placeholder={placeholder ?? "Type value here"}/>
    );
};