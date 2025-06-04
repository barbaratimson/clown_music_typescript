import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getImageLink } from "../../../utils/utils";
import "./style.scss";
import { MusicNote } from "@mui/icons-material";

export type CoverSizeT = "50x50" | "100x100" | "150x150" | "200x200" | "300x300" |
    "400x400" | "500x500" | "600x600" | "700x700" | "800x800" |
    "900x900" | "1000x1000";

interface CoverProps {
    size: string;
    imageSize?: CoverSizeT;
    unWrapped?: boolean;
    placeholder?: any;
    src: string;
    className?: string;
    blurIntensity?: number;
}

const Cover = memo(({ src, size, unWrapped, placeholder, className, blurIntensity = 5 }: CoverProps) => {
    const [width, height] = size.split("x");
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
        if (!src) {
            setIsLoaded(false);
            return;
        }

        const img = new Image();
        img.src = src;
        img.onload = () => {
            setIsLoaded(true);
            // Keep placeholder visible until image is fully loaded and transition completes
        };
        img.onerror = () => setIsLoaded(false);
    }, [src]);

    if (!unWrapped) {
        if (!src) return (
            <div style={{ minWidth: width + "px", height: height + "px" }} className={`cover-wrapper ${className}`}>
                {placeholder ?? <ImagePlaceholder />}
            </div>
        );

        return (
            <div style={{
                minWidth: width + "px",
                height: height + "px",
                position: 'relative',
                overflow: 'hidden'
            }} className={`cover-wrapper ${className}`}>
                {/* Blurred placeholder */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                        opacity: isLoaded ? 0 : 1
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: `blur(${blurIntensity}px)`
                    }}
                    onAnimationComplete={() => {
                        if (isLoaded) setShowPlaceholder(false);
                    }}
                >
                    {placeholder ?? <ImagePlaceholder />}
                </motion.div>

                {/* Actual image */}
                <motion.img
                    style={{
                        minWidth: width + "px",
                        height: height + "px",
                        objectFit: 'cover',
                        filter: isLoaded ? 'blur(0px)' : `blur(${blurIntensity}px)`,
                        transition: 'filter 0.4s ease-out'
                    }}
                    src={src}
                    loading="lazy"
                    alt=""
                    onLoad={() => setIsLoaded(true)}
                />
            </div>
        );
    } else {
        if (!src) return placeholder ?? <ImagePlaceholder />;
        return (
            <motion.img
                className={className}
                src={src}
                loading="lazy"
                alt=""
                style={{
                    filter: isLoaded ? 'blur(0px)' : `blur(${blurIntensity}px)`,
                    transition: 'filter 0.4s ease-out'
                }}
                onLoad={() => setIsLoaded(true)}
            />
        );
    }
});

interface ImagePlaceholderProps {
    size?: 'inherit' | 'large' | 'medium' | 'small';
    children?: any;
}


export const ImagePlaceholder = ({ size, children }: ImagePlaceholderProps) => {
    return (
        <motion.div
            className="image-placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {children ?? <MusicNote fontSize={size ?? "large"} />}
        </motion.div>
    );
};

export default Cover;