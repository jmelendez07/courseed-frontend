import { THEME, ThemeContext } from "@/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import React from "react";

function Theme({ className }: { className?: string }) {

    const themeContext = React.useContext(ThemeContext);

    return (
        <div className={className}>
            {themeContext?.theme === THEME.LIGHT ? (
                <Moon
                    className="cursor-pointer size-5"
                    onClick={() => themeContext.handleChange(THEME.DARK)}
                />
            ) : (
                <Sun
                    className="cursor-pointer size-5"
                    onClick={() => themeContext?.handleChange(THEME.LIGHT)}
                />
            )}
        </div>
    )
}

export default Theme;