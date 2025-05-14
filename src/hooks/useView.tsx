import APIS from "@/enums/apis";
import ViewInterface from "@/interfaces/view";
import axios from "axios";
import React from "react";

interface useViewProps {
    cId: string;
}

function useView({ cId }: useViewProps) {

    const [courseId, setCourseId] = React.useState<String | null>(cId);

    const handleCreate = React.useCallback(async (): Promise<ViewInterface | null> => {
        try {
            const response = await axios.post(APIS.VIEWS_CREATE, { 
                courseId: courseId
            });
            return response.data;
        } catch (error) {
            return null;
        }
    }, [courseId]);

    return {
        handleCreate,
        courseId,
        setCourseId
    };
}

export default useView;