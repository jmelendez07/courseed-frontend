import { Building, Pen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import InstitutionInterface from "@/interfaces/institution";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { Button } from "../ui/button";
import UpdateInstitutionForm from "../form/update-institution-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function DashboardInstitutionProfile() {

    const [institution, setInstitution] = React.useState<InstitutionInterface | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [updateOpen, setUpdateOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.INSTITUTION_BY_AUTH)
            .then((response: AxiosResponse<InstitutionInterface>) => {
                setInstitution(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center">
                    Información de la institución
                    <Building className="ml-2 h-4 w-4 min-w-4" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                { loading || !institution
                    ? (
                        <div className="flex flex-col items-center sm:flex-row sm:flex-wrap gap-4 animate-pulse">
                            <div className="h-24 w-24 bg-slate-200 rounded-md"></div>
                            <div className="py-1">
                                <div className="h-6 mx-auto sm:mx-0 w-80 bg-slate-200 rounded-sm"></div>
                                <div className="h-4 mx-auto sm:mx-0 w-40 bg-slate-200 rounded-sm mt-1"></div>
                                <div className="h-8 mx-auto sm:mx-0 w-40 bg-slate-300 rounded-sm mt-4"></div>
                            </div>
                        </div>
                    )
                    : (
                        <>
                            <div className="flex flex-col items-center sm:flex-row sm:flex-wrap gap-4">
                                <Avatar className="size-32 rounded-md">
                                    <AvatarImage 
                                        src={institution.image ?? ""} 
                                        alt={institution.name}
                                        className="rounded-md border-2 border-gray-200 object-cover"
                                    />
                                    <AvatarFallback className="text-4xl rounded-md border-2 border-gray-200">{institution.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="py-1 text-center sm:text-start">
                                    <h5 className="font-semibold text-xl">{ institution.name }</h5>
                                    <p className="text-gray-600 text-sm">Institución registrada</p>
                                    <Button 
                                        onClick={() => setUpdateOpen(true)}
                                        className="mt-4"
                                    >
                                        <Pen className="size-5" />
                                        Editar información
                                    </Button>
                                </div>
                            </div>
                            <UpdateInstitutionForm 
                                open={updateOpen} 
                                setOpen={(value) => setUpdateOpen(value)} 
                                institution={institution}
                                setInstitution={(value) => setInstitution(value)}
                            />
                        </>
                    )
                }
            </CardContent>
        </Card>
    );
}

export default DashboardInstitutionProfile;