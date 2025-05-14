import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLogin from "@/hooks/useLogin";
import { Link } from "react-router-dom";
import { Info, LoaderCircle } from "lucide-react";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {

	const login = useLogin();

	return (
		<form 
			onSubmit={e => {
				e.preventDefault();
				login.handleLogin();
			}} 
			className={cn("flex flex-col gap-6", className)} 
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Inicia sesión en su cuenta</h1>
				<p className="text-balance text-sm text-zinc-500 dark:text-zinc-400">
					Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Correo Electronico</Label>
					<Input 
						id="email" 
						type="email" 
						placeholder="nombre@organizacion.tipo"
						autoComplete="email" 
						onChange={e => {
							login.setCredential(e);
							login.setError(e);
						}}
						value={login.credentials.email}
						disabled={login.loading}
					/>
					{login.credentialsErrors.email && (
						<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
							<Info className="w-3 h-3 min-h-3 min-w-3" />
							<span>
								{login.credentialsErrors.email}
							</span>
						</p>
					)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Contraseña</Label>
					<Input 
						id="password" 
						type="password" 
						autoComplete="current-password"
						onChange={e => {
							login.setCredential(e);
							login.setError(e);
						}}
						value={login.credentials.password}
						disabled={login.loading}
					/>
					{(login.credentialsErrors.password || login.credentialsErrors.auth) && (
						<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
							<Info className="w-3 h-3 min-h-3 min-w-3" />
							<span>
								{login.credentialsErrors.password || login.credentialsErrors.auth}
							</span>
						</p>
					)}
				</div>
				<Button type="submit" className="w-full" disabled={login.loading || login.disabled}>
					Acceder
					{login.loading && (
						<LoaderCircle className="animate-spin" />
					)}
				</Button>
			</div>
			<div className="text-center text-sm">
				¿No tienes una cuenta?{" "}
				<Link to="/registro" className="underline underline-offset-4">
					Registrate Aqui
				</Link>
			</div>
		</form>
	)
}
