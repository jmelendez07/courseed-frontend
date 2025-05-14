import { Image as ImageLucide } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

interface LazyImageProps {
    src: string;
    className?: string;
    width?: number;
    height?: number;
}

function LazyImage({ src, className, width = 500, height = 300 }: LazyImageProps) {
    const [loadedImage, setLoadedImage] = React.useState<string>();
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        });

        if (divRef.current) observer.observe(divRef.current);

        return () => {
            if (observer) observer.disconnect();
        }
    }, [divRef]);

    React.useEffect(() => {
        if (!src || !isVisible) return;

        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (ctx) {
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0, width, height);

                try {
                    const resizedImageURL = canvas.toDataURL("image/jpeg");
                    setLoadedImage(resizedImageURL);
                } catch (error) {
                    setLoadedImage(src);
                }
            }
        };

        image.onerror = () => {
            setLoadedImage(src);
        };

        image.src = src;
    }, [src, width, height, isVisible]);

    return (
        <div ref={divRef} className={`relative w-full overflow-hidden ${className} bg-zinc-100 dark:bg-zinc-900`}>
            {!loadedImage && (
                <div className="flex absolute w-full h-full top-0 left-0 items-center justify-center">
                    <ImageLucide className="size-24 stroke-1 animate-pulse text-zinc-200 dark:text-zinc-800" />
                </div>
            )}
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 1.1,
                    filter: 'blur(10px)',
                }}
                animate={{
                    opacity: loadedImage ? 1 : 0,
                    scale: loadedImage ? 1 : 1.1,
                    filter: loadedImage ? 'blur(0px)' : 'blur(10px)',
                }}
                transition={{
                    opacity: { duration: .5 },
                    scale: { type: 'inertia', stiffness: 100, damping: 25 },
                    filter: { duration: .5 },
                }}
                className="h-full w-full"
            >
                {loadedImage &&
                    <img
                        src={loadedImage}
                        alt={loadedImage}
                        className={className}
                    />
                }
            </motion.div>
        </div>
    );
};

export default LazyImage;
