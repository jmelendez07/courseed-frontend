import APIS from "@/enums/apis";
import REACTION from "@/enums/reaction";
import ReactionInterface from "@/interfaces/reaction";
import axios from "axios";

function useReaction() {
    const handleCreate = async (courseId: String, type: keyof typeof REACTION): Promise<ReactionInterface | null> => {
        try {
            const response = await axios.post(APIS.REACTION_CREATE, { 
                courseId: courseId,
                type: type 
            });
            return response.data;
        } catch (error) {
            return null;
        }
    }

    const handleUpdate = async (courseId: String, type: keyof typeof REACTION): Promise<ReactionInterface | null> => {
        try {
            const response = await axios.put(APIS.REACTION_UPDATE, {
                courseId: courseId,
                type: type
            });
            console.log(response);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    const handleDelete = async (id: String): Promise<boolean> => {
        try {
            await axios.delete(APIS.REACTION_DELETE + id);
            return true;
        } catch (error) {
            return false;
        }
    }

    return {
        handleCreate,
        handleUpdate,
        handleDelete
    };
}

export default useReaction;