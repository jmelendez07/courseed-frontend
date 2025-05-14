import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "../ui/card";
import WelcomeTreeDraw from "../draws/WelcomeTreeDraw";
import WelcomeCatsDraw from "../draws/WelcomeCatsDraw";
import { motion, AnimatePresence } from "motion/react";
import React from "react";
import ROLES from "@/enums/roles";
import HelloDraw from "../draws/HelloDraw";

function WelcomeBanner() {
    const authHook = useAuth();
    const [currentDraw, setCurrentDraw] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDraw((prev) => (prev + 1) % 3);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const draws = [
        <WelcomeTreeDraw key="tree" />,
        <WelcomeCatsDraw key="cats" />,
        <HelloDraw key="hello" />
    ];

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
                        <h2 className="mb-2 text-2xl sm:text-4xl font-bold tracking-tight">¡Bienvenid@ { authHook?.getName() }!</h2>
                        <p className="mb-6 hidden sm:block text-muted-foreground">
                            { authHook?.user?.roles?.some(role => role === ROLES.SUBSCRIBER) ? (
                                '¡Bienvenido a tu espacio en Courseed! Desde aquí puedes crear y gestionar tus programas educativos, actualizar tu plan de suscripción, y acceder a análisis descriptivos para conocer el desempeño de tus contenidos. Además, al crear un nuevo programa, recibirás una predicción que te ayudará a saber si será bien recibido por los usuarios.'
                            ) : '¡Bienvenido a Courseed! Aquí podrás descubrir cursos recomendados especialmente para ti, explorar los programas que has reseñado o reaccionado, y revisar tu historial de búsqueda y aprendizaje. Usa el menú lateral para navegar por todas las secciones y saca el máximo provecho a tu experiencia educativa.' }
                        </p>
                    </div>
                    <div className="relative flex items-center h-52 sm:h-auto justify-center sm:bg-muted p-6 md:w-2/5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentDraw}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="absolute w-full h-full flex items-center justify-center"
                            >
                                {draws[currentDraw]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default WelcomeBanner; 