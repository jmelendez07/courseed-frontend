import React from "react";
import { useLocation } from "react-router-dom";

interface HeadProviderProps {
    title: string
}

function HeadProvider({ title } : HeadProviderProps): null {
    const location = useLocation();

    React.useEffect(() => {
        document.title = title;
    }, [location, title]);

    return null;

}

export default HeadProvider;