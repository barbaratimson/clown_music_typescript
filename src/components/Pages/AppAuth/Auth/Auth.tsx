import {Input} from "../../../UI/Input/Input";
import {FileInput} from "../../../UI/FileInput/FileInput";
import React, {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {authorizeUser, fetchCmUser} from "../../../../utils/cmApiRequsts";
import {Upload} from "@mui/icons-material";
interface AuthFormInput {
    email: string,
    password: string
}

export const Auth = () => {
    const [success, setSuccess] = useState(false)
    const {register, handleSubmit} = useForm<AuthFormInput>();
    const onSubmit: SubmitHandler<AuthFormInput> = (data) => {authorizeUser(data).then(()=> window.location.reload())}

    return (
        <form className="flex flex-col gap-5 rounded-xl min-w-[500px] p-5 bg-white/20 max-sm:min-w-full max-sm:rounded-none" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-[32px] text-white ">Login</h1>
            <Input register={register("email", {required: true, maxLength: 50})} placeholder="Email"/>
            <Input type={"password"} register={register("password", {required: true, maxLength: 50})} placeholder="Password"/>
            <button className="upload-form-button-send bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2" type="submit">Login</button>
        </form>
    );
};