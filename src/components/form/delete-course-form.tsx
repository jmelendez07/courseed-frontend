import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import axios, { AxiosError } from "axios";
import React from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import { DialogContext } from "@/providers/DialogProvider";

interface DeleteCourseProps {
    course: CourseInterface;
    onDeleted?: (course: CourseInterface) => void
}

interface ErrorProps {
    courseId: string | null;
}

function DeleteCourseForm({ course, onDeleted }: DeleteCourseProps) {
    const dialogContext = React.useContext(DialogContext);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        
        axios.delete(`${APIS.COURSES_DELETE}${course.id}`)
            .then(() => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${course.title} Eliminado!`,
                    description: dayjs().format("LLL"),
                });
                if (onDeleted) onDeleted(course);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${course.title}. Algo salió mal!`,
                    description: error.response?.data.courseId,
                    variant: "destructive",
                });
            })
            .finally(() => setLoading(false));
    } 

    return (
        <form onSubmit={handleSubmit} className="grid items-center justify-center gap-2">
            <Button
                type="submit"
                disabled={loading}
            >
                <p className="max-w-full truncate inline-flex items-center gap-2">
                    Eliminar Permanentemente
                    {loading && (
                        <LoaderCircle className="animate-spin" />
                    )}
                </p>
            </Button>
        </form>
    );
}

export default DeleteCourseForm;