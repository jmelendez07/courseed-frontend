import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ColorContext, colors, ColorType } from "@/providers/ColorProvider";

interface ColorSelectorProps {
    color: ColorType | string;
    onChange: (color: ColorType) => void;
}

function Color() {
    const colorContext = React.useContext(ColorContext);

    return (
        <div>
            <ColorSelector 
                color={colorContext ? colorContext.color : colors[0].label} 
                onChange={(color: ColorType) => {
                    if (colorContext) colorContext.setColor(color);
                }} 
            />
        </div>
    );
}

export function ColorSelector({ color, onChange }: ColorSelectorProps) {
    const currentColor = colors.find((c) => c.value === color)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded="false"
                    className="gap-2 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 
                focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
                [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent min-w-9 group flex h-10 w-10 shrink-0 items-center 
                justify-center rounded-lg border-2 border-transparent p-0 hover:bg-transparent focus-visible:bg-transparent"
                >
                    <ColorButton colorValue={currentColor?.value || colors[0].value} />
                    <span className="sr-only">Selecciona un color</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-3">
                <div className="grid grid-cols-4 gap-2">
                    {colors.map((c) => (
                        <button
                            key={c.value}
                            className={`group flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent transition-colors ${color === c.value && 'bg-accent'}`}
                            onClick={() => onChange(c.value)}
                            title={c.label}
                        >
                            <ColorButton colorValue={c.value} />
                            <span className="sr-only">Selecciona el color {c.label}</span>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

function ColorButton({ colorValue }: { colorValue: string; }) {
    return (
        <div className="h-6 w-6 overflow-hidden rounded-sm">
            <div
                className="grid h-12 w-12 -translate-x-1/4 -translate-y-1/4 grid-cols-2 overflow-hidden 
                rounded-md transition-all ease-in-out rotate-45 group-hover:rotate-0"
            >
                <span className={`flex h-6 w-6 bg-${colorValue}-800`}></span>
                <span className={`flex h-6 w-6 bg-${colorValue}-700`}></span>
                <span className={`flex h-6 w-6 bg-${colorValue}-600`}></span>
                <span className={`flex h-6 w-6 bg-${colorValue}-500`}></span>
            </div>
        </div>
    )
}

export default Color;