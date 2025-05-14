import APIS from "@/enums/apis";
import UserInterface from "@/interfaces/user";
import axios, { AxiosResponse } from "axios";
import React from "react";

interface ResponseUserProps {
	content: UserInterface[];
	last: boolean;
}

interface useUserProps {
	size?: number;
	replaceUsers?: boolean;
}

function useUsers({ size, replaceUsers = false }: useUserProps) {
    const pageSize: number = size ?? 12;
    const [users, setUsers] = React.useState<UserInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState<number>(0);

    React.useEffect(() => {
		setLoading(true);
		axios.get(APIS.USERS, {
			params: {
				page: pageNumber,
				size: pageSize
			}
		})
			.then((response: AxiosResponse<ResponseUserProps>) => {
				setUsers(currentUsers => 
					[
						...(!replaceUsers && pageNumber > 0) ? currentUsers : [],
						...response.data.content
					]
				);
				setIsLastPage(response.data.last);
			})
			.catch(() => setIsLastPage(true))
			.finally(() => setLoading(false));
	}, [pageNumber, pageSize]);

	const handleUpdateUser = (user: UserInterface) => {
		setUsers(users.map(u => u.id === user.id ? user : u));
	}

	const handleDeleteUser = (user: UserInterface) => {
		setUsers(users.filter(u => u.id !== user.id));
	}

    return {
		users,
		loading,
		pageSize,
		pageNumber,
		isLastPage,
		setUsers,
		setLoading,
		setPageNumber,
		setIsLastPage,
		handleUpdateUser,
		handleDeleteUser
	}
}

export default useUsers;