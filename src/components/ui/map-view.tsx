import { Map, Marker, Popup } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';
import { MapPin } from "lucide-react";

const mapStyles = {
    satellite: "https://tiles.stadiamaps.com/styles/alidade_satellite.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    transport: "https://tiles.stadiamaps.com/styles/outdoors.json",
} as const;

export const capitals = [
    { name: "Barranquilla", lat: 10.9685, lng: -74.7813, dept: "Atlántico", color: "#ff5733" },
    { name: "Cartagena", lat: 10.3910, lng: -75.4794, dept: "Bolívar", color: "#33a1ff" },
    { name: "Valledupar", lat: 10.4742, lng: -73.2438, dept: "Cesar", color: "#33ff57" },
    { name: "Montería", lat: 8.7500, lng: -75.8814, dept: "Córdoba", color: "#f4d03f" },
    { name: "Riohacha", lat: 11.5444, lng: -72.9064, dept: "La Guajira", color: "#9b59b6" },
    { name: "Santa Marta", lat: 11.2408, lng: -74.1990, dept: "Magdalena", color: "#e74c3c" },
    { name: "Sincelejo", lat: 9.3047, lng: -75.3978, dept: "Sucre", color: "#1abc9c" },
    { name: "San Andrés", lat: 12.5833, lng: -81.7000, dept: "San Andrés", color: "#2ecc71" },
];

type MapStyleKey = keyof typeof mapStyles;

const MapView = ({ className }: { className?: string }) => {
    const [currentStyle, setCurrentStyle] = React.useState<string>(mapStyles.transport);
    const [selected, setSelected] = React.useState<{ name: string; dept: string } | null>(null);

    const handleStyleChange = (value: string) => {
        const selectedStyle = value as MapStyleKey;
        setCurrentStyle(mapStyles[selectedStyle]);
    };

    return (
        <div className={`w-full h-full relative ${className}`}>
            <Map
                initialViewState={{
                    longitude: -74.8741,
                    latitude: 9,
                    zoom: 6
                }}
                mapStyle={currentStyle}
            >
                {capitals.map((city) => (
                    <Marker key={city.name} latitude={city.lat} longitude={city.lng}>
                        <button onClick={() => setSelected(city)} className="flex items-center justify-center">
                            <MapPin
                                className="w-8 h-8"
                                fill={city.color}
                                color="#fff"
                                strokeWidth={1}
                            />
                        </button>
                    </Marker>
                ))}

                {selected && (
                    <Popup
                        latitude={capitals.find((c) => c.name === selected.name)?.lat || 0}
                        longitude={capitals.find((c) => c.name === selected.name)?.lng || 0}
                        onClose={() => setSelected(null)}
                    >
                        <h3 className="font-bold">{selected.name}</h3>
                        <p className="text-sm text-gray-600">{selected.dept}</p>
                    </Popup>
                )}
            </Map>
            <div className="absolute top-4 right-4">
                <Select
                    onValueChange={handleStyleChange}
                >
                    <SelectTrigger className="w-[180px] bg-zinc-50 dark:bg-zinc-950">
                        <SelectValue placeholder="Estilos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Opciones de Estilos</SelectLabel>
                            <SelectItem value="satellite">Imagenes Satelitas</SelectItem>
                            <SelectItem value="dark">Estilo oscuro</SelectItem>
                            <SelectItem value="light">Estilo minimalista</SelectItem>
                            <SelectItem value="transport">Transporte</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default MapView;