import UserInterface from "./user";

interface InstitutionInterface {
    id: string | null | undefined;
    name: string | undefined;
    image: string | null;
    user: UserInterface | null;
}

export default InstitutionInterface;