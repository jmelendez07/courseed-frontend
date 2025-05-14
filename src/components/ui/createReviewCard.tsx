import UserInterface from "@/interfaces/user";
import { Card, CardContent } from "./card";
import { Avatar, AvatarFallback } from "./avatar";
import React from "react";
import { MessageSquareDiff, PenLine } from "lucide-react";

interface CreateReviewCardProps {
    className?: string;
    user: UserInterface;
    onClick?: () => void;
}

function CreateReviewCard({ className, user, onClick }: CreateReviewCardProps) {

    const getName = React.useCallback(() => {
        const name = user.email.split('@')[0];
        if (name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return '';
    }, [user.email]);

    return (
        <Card
            className={`flex flex-col transition-all duration-300 ease-in-out cursor-pointer 
                hover:shadow-lg group bg-gradient-to-br from-background to-muted/50 
                ${className}`
            }
            onClick={() => onClick && onClick()}
        >
            <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{user?.email?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{getName()}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg px-4 group-hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <PenLine className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div>
                            <p className="text-xl font-medium">Crear Reseña</p>
                            <p className="text-sm text-muted-foreground">Comparte tu experiencia</p>
                        </div>
                    </div>
                    <MessageSquareDiff className="w-6 h-6 transition-all group-hover:translate-x-1 text-muted-foreground group-hover:text-primary" />
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                    {new Date().toLocaleDateString("es", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </CardContent>
        </Card>
    );
}

export default CreateReviewCard;