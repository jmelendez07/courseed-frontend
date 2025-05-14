import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import React from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, UserPen, UserX, ArrowUpDown, MessageSquareText, Heart } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import UserInterface from "@/interfaces/user";
import ROLES from "@/enums/roles";
import useUsers from "@/hooks/useUsers";
import { useAuth } from "@/providers/AuthProvider";
import UpdateUserForm from "@/components/form/update-user-form";
import { DialogContext } from "@/providers/DialogProvider";
import DeleteUserForm from "@/components/form/delete-user-form";
import { Avatar, AvatarFallback } from "./ui/avatar";

function UserDataTable() {
	const userHook = useUsers({ replaceUsers: true });
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	const columns: ColumnDef<UserInterface>[] = [
		{
			accessorKey: "email",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Correo Electronico
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => {
				const email: string = row.getValue('email');
				return (
					<div className="flex items-center gap-2 pl-3.5">
						<Avatar>
							<AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<p>{email}</p>
					</div>
				);
			}
		},
		{
			accessorKey: "roles",
			header: "Roles",
			cell: ({ row }) => {
				const roles: string[] = row.getValue('roles');
				return roles.map(role => {
					if (role === ROLES.ADMIN) return 'Administrador';
					if (role === ROLES.USER) return 'Usuario';
					if (role === ROLES.SUBSCRIBER) return 'Suscriptor';
					return role;
				}).join(', ');
			}
		},
		{
			accessorKey: "reviews",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Reseñas
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => {
				const reviews = parseFloat(row.getValue("reviews"))
	
				return <div className="flex items-center pl-3.5">
					{reviews}
					<MessageSquareText className="ml-2 h-4 w-4" />
				</div>
			},
		},
		{
			accessorKey: "reactions",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Reacciones
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => {
				const reactions = parseFloat(row.getValue("reactions"));
	
				return <div className="flex items-center pl-3.5">
					{reactions}
					<Heart className="ml-2 h-4 w-4" />
				</div>
			},
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Cuenta Creada en
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				)
			},
			cell: ({ row }) => {
				const createdAt: string = row.getValue("createdAt");
				const formatedCreatedAt: string = dayjs(createdAt).format("LLLL");
	
				return (
					<p className="pl-3.5">
						{formatedCreatedAt.charAt(0).toUpperCase() + formatedCreatedAt.slice(1)}
					</p>
				)
			}
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const payment = row.original
				const auth = useAuth();
				const dialogContext = React.useContext(DialogContext);
				const updateUserForm = {
					title: `Actualizar a ${payment.email}`,
					description: "Actualiza parcialmente la información del usuario.",
					open: true,
					dialogChildren: <UpdateUserForm 
						user={payment}
						onUpdate={(u) => userHook.handleUpdateUser(u)}
					/>
				}
				const deleteUserForm = {
					title: `Eliminar a ${payment.email}`,
					description: "¿Estas seguro de querer eliminar este usuario? No podras recuperarla",
					open: true,
					dialogChildren: <DeleteUserForm 
						user={payment}
						onDeleted={(u) => userHook.handleDeleteUser(u)}
					/>
				}
	
				if (auth?.user?.email === payment.email) {
					return null;	
				}
	
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Abrir Opciones</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Acciones</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => dialogContext?.setContext(updateUserForm)}>
								<UserPen /> Editar Usuario
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => dialogContext?.setContext(deleteUserForm)}>
								<UserX /> Eliminar Usuario
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	];

	const table = useReactTable({
		data: userHook.users,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div className="max-w-full">
			<div className="flex sm:items-center pb-4 flex-col gap-2 sm:flex-row sm:justify-between">
				<div className="flex items-center">
					<h2 className="text-xl font-semibold">Gestion de Usuarios</h2>
				</div>
				<Input
					placeholder="Buscar por correo electronico..."
					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("email")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div 
				className="rounded-md border border-zinc-200 dark:border-zinc-800 
				dark:file:text-zinc-50 dark:placeholder:text-zinc-400 
				dark:focus-visible:ring-zinc-300"
			>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-5">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No hay Usuarios.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => userHook.setPageNumber(userHook.pageNumber - 1)}
					disabled={userHook.pageNumber <= 0}
				>
					Anterior
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => userHook.setPageNumber(userHook.pageNumber + 1)}
					disabled={userHook.isLastPage}
				>
					Siguiente
				</Button>
			</div>
		</div>
	);
}

export default UserDataTable;