import React from "react";
import { createAvatar } from '@dicebear/core';
import * as botttsNeutral from '@dicebear/bottts-neutral';
import { motion } from "motion/react";

interface AvatarProfileProps {
    name: string;
    imageUrl?: string;
    className?: string;
}

function AvatarProfile({ name, imageUrl, className }: AvatarProfileProps) {
    const avatar = React.useMemo(() => {
        return createAvatar(botttsNeutral, {
            size: 128,
            seed: name
        }).toDataUri();
    }, [name]);

    const [imgSrc, setImgSrc] = React.useState(avatar);

    React.useEffect(() => {
        if (!imageUrl) return;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => setImgSrc(imageUrl);
        img.onerror = () => setImgSrc(avatar);
    }, [imageUrl, avatar]);

    return (
        <div>
            <motion.img 
                key={imgSrc}
                src={imgSrc} 
                alt={name}
                className={`size-8 rounded-lg object-cover ${className}`} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );

}

export default AvatarProfile;