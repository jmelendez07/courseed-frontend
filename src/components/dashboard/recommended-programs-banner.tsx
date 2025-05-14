import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import React from "react";
import { ColorContext } from "@/providers/ColorProvider";
import axios from "axios";
import APIS from "@/enums/apis";

export function RecommendedProgramsBanner() {
    const colorContext = React.useContext(ColorContext);
    const [programCount, setProgramCount] = React.useState<number>(0);
     
    React.useEffect(() => {
        axios.get(APIS.USER_COURSES_RECOMENDED_COUNT)
            .then((response) => {
                if (typeof response.data.totalCourses === "number") {
                    setProgramCount(response.data.totalCourses);
                }
            })
            .catch((error) => {
                console.error("Error fetching recommended programs count:", error);
            });
    }, []);

    return (
        <div className="relative overflow-hidden rounded-lg">
            <div className={`absolute inset-0 bg-gradient-to-r from-${colorContext?.color}-700 to-${colorContext?.getReverseColor()}-500`}>
                <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className={`absolute h-12 w-4 bg-white/20 rotate-45 transform ${i % 2 === 0 ? "bg-white/30" : "bg-white/10"
                                }`}
                            style={{
                                right: `${10 + i * 15}%`,
                                top: `${i * 12 - 20}%`,
                                height: "200%",
                                width: `${6 + (i % 3) * 4}px`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-between p-6 gap-4 text-white z-10">
                <div className="text-left flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold flex items-center">
                            {programCount}
                            <span className="ml-1">programas recomendados</span>
                        </h3>
                        <p className="text-white/80 mt-1">
                            Descubre programas seleccionados especialmente para ti
                        </p>
                    </div>
                </div>
                <Button
                    asChild
                    className="bg-white text-blue-700 hover:bg-white/90 hover:text-blue-800 whitespace-nowrap"
                >
                    <Link to="/educacion" className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ver todos los programas
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
