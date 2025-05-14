import React from "react";

type Theme = 'dark' | 'light';

export enum THEME {
    DARK = 'dark',
    LIGHT = 'light'
}

interface ThemeProps {
    theme: Theme | string;
    handleChange: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeProps | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = React.useState<Theme | string>(localStorage.getItem("theme") || "light");

    const handleChange = (newTheme: Theme) => {
        setTheme(newTheme);
    }

    React.useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.style.colorScheme = "dark";
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.style.colorScheme = "light";
        }

        localStorage.setItem("theme", theme); 
    }, [theme]);

    const contextValue: ThemeProps = React.useMemo(
        () => ({
            theme,
            handleChange
        }), [theme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
export { ThemeContext };