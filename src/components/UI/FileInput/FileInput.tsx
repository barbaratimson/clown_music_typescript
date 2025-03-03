import {ChangeHandler, UseFormRegisterReturn} from "react-hook-form";
import "./FileInput.scss"
import React, {ChangeEvent, forwardRef, useEffect, useRef, useState} from "react";
import Cover from "../Cover";

interface FileInputProps {
    register: UseFormRegisterReturn<any>,
    fileType: "audio" | "image",
}

export const FileInput = ({register, fileType}: FileInputProps) => {
    const [preview, setPreview] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)
    const {ref, ...rest} = register

    const getBase64 = async function (file: File | null)     {
        if (!file) return
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setPreview(reader.result as string)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const onChangeMiddleware = (e: ChangeEvent<HTMLInputElement>, onChange: ChangeHandler) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        const emptyEvent = {
            ...e,
            target: {
                ...e.target,
                files: [],
            },
        };
        if (file) {
            if (file.type.includes(fileType)) {
                onChange(e)
            } else {
                onChange(emptyEvent)
                console.log("Wrong file format")
            }
        }
        getBase64(file)
    }

    useEffect(() => {
        ref(inputRef.current)
    }, []);

    return (
        <>
            {fileType === "audio" && (
                <div className="audio-file-input" onClick={async () => {
                    inputRef.current?.click()
                }}>
                    <audio controls src={preview}/>
                </div>
            )}
            {fileType === "image" && (
                <div className="image-file-input" onClick={async () => {
                    inputRef.current?.click()
                }}>
                    <Cover src={preview} size={"200x200"} imageSize="1000x1000" placeholder={<div>Upload image</div>}/>
                </div>
            )}
            <input style={{display: "none"}} className="file-input" type="file" ref={inputRef} name={register.name}
                   onBlur={register.onBlur} onChange={(e) => {
                onChangeMiddleware(e, register.onChange)
            }}></input>
        </>
    );
};
