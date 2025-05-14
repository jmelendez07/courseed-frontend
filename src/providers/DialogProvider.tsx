import ResponsiveDialog from "@/components/ui/responsive-dialog";
import React from "react";

interface ChildrenProps {
    children: React.ReactNode,
}

interface ContextProps {
    open: boolean;
    title: string;
    description: string;
    dialogChildren: React.ReactNode | null
}

interface DialogContextProps {
    context: ContextProps;
    setContext: React.Dispatch<React.SetStateAction<ContextProps>>;
}

const DialogContext = React.createContext<DialogContextProps | null>(null);

function DialogProvider({ children }: ChildrenProps) {
    const [context, setContext] = React.useState<ContextProps>({
        open: false,
        title: "",
        description: "",
        dialogChildren: null
    });

    const contextValue: DialogContextProps = React.useMemo(
        () => ({
            context,
            setContext
        }), [context]
    );

    return (
        <DialogContext.Provider value={contextValue}>
            {children}
            <ResponsiveDialog 
                open={context.open}
                title={context.title}
                description={context.description}
                setOpen={isOpen => setContext({
                    ...context,
                    open: isOpen
                })}
            >
                {context.dialogChildren}
            </ResponsiveDialog>
        </DialogContext.Provider>
    );
}

export default DialogProvider;
export { DialogContext }