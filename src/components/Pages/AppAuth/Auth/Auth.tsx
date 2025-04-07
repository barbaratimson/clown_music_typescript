import {Input} from "../../../UI/Input/Input";
import {FileInput} from "../../../UI/FileInput/FileInput";
import React, {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {authorizeUser, fetchCmUser} from "../../../../utils/cmApiRequsts";
interface AuthFormInput {
    email: string,
    password: string
}

export const Auth = () => {
    const [success, setSuccess] = useState(false)
    const {register, handleSubmit} = useForm<AuthFormInput>();
    const onSubmit: SubmitHandler<AuthFormInput> = (data) => {authorizeUser(data).then(()=> window.location.reload())}

    return (
        <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
            <Input register={register("email", {required: true, maxLength: 50})} placeholder="Email"/>
            <Input type={"password"} register={register("password", {required: true, maxLength: 50})} placeholder="Password"/>
            <input className="upload-form-button-send" type="submit"/>
        </form>
    );
};