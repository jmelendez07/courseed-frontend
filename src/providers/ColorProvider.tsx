import React from "react";

export type ColorType =
    | 'amber'
    | 'lime'
    | 'sky'
    | 'blue'
;

export const colors: { value: ColorType; label: string; }[] = [
    { value: "amber", label: "Ambarino" },
    { value: "lime", label: "Lima" },
    { value: "sky", label: "Azul Cielo" },
    { value: "blue", label: "Azul" },
];

interface ColorProps {
    color: ColorType | string;
    setColor: (theme: ColorType) => void;
    getReverseColor: () => string;
}

export const ColorContext = React.createContext<ColorProps | null>(null);

function ColorProvider({ children }: { children: React.ReactNode }) {
    const [color, setColor] = React.useState<ColorType | string>(localStorage.getItem("color") || "sky");

    React.useEffect(() => localStorage.setItem("color", color), [color]);

    const getReverseColor = React.useCallback((): string => {
        const complementaryColors: Record<ColorType, string> = {
            'amber': 'blue',
            'lime': 'teal',
            'sky': 'orange',
            'blue': 'yellow',
        };
        
        if (color in complementaryColors) {
            return complementaryColors[color as ColorType];
        }
        
        return 'blue';
    }, [color]);

    const contextValue: ColorProps = React.useMemo(
        () => ({
            color,
            setColor,
            getReverseColor
        }), [color, getReverseColor]
    );

    return (
        <ColorContext.Provider value={contextValue}>
            {children}
        </ColorContext.Provider>
    );
}

export default ColorProvider;