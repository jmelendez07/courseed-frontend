import { cn, validateEmail, validatePasswordLength } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { CalendarIcon, Info, LoaderCircle } from "lucide-react";
import useRegister from "@/hooks/useRegister";
import React from "react";
import { motion } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

enum STEPS {
	ONE = 1,
	TWO = 2
}

export function RegisterForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {

	const register = useRegister();
	const [currentStep, setCurrentStep] = React.useState<STEPS>(STEPS.ONE);
	const [month, setMonth] = React.useState<Date>(new Date());
	const [yearInput, setYearInput] = React.useState<string>(`${month.getFullYear()}`);

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d*$/.test(value)) {
			setYearInput(value);
			const year = parseInt(value);
			if (year > 1800 && year <= new Date().getFullYear()) {
				setMonth(new Date(year, month.getMonth()));
			}
		}
	};

	const nextStep = () => {
		let disabled: boolean = false;
		if (register.credentials.email.trim().length === 0) {
			register.setCredentialsErrors(current => ({
				...current,
				email: "Debes completar el campo correspondiente al correo electrónico."
			}));
			disabled = true;
		}
		
		if (register.credentials.password.trim().length === 0) {
			register.setCredentialsErrors(current => ({
				...current,
				password: "Debes completar el campo correspondiente a la contraseña."
			}));
			disabled = true;
		} 

		if (register.credentials.confirmPassword.trim().length === 0) {
			register.setCredentialsErrors(current => ({
				...current,
				confirmPassword: "Debes completar el campo correspondiente a la contraseña."
			}));
			disabled = true;
		} 

		if (disabled) {
			return register.setDisabled(true);	
		}

		if (!validateEmail(register.credentials.email)) {
			register.setCredentialsErrors(current => ({
				...current,
				email: "Asegúrate de que el correo electrónico proporcionado sea correcto y válido."
			}));
			disabled = true;
		}

		if (!validatePasswordLength(register.credentials.password)) {
			register.setCredentialsErrors(current => ({
				...current,
				password: "Es necesario que la contraseña que elijas tenga un mínimo de 8 y un máximo de 20 caracteres."
			}));
			disabled = true;
		} 
		
		if (register.credentials.password !== register.credentials.confirmPassword) {
			register.setCredentialsErrors(current => ({
				...current,
				confirmPassword: "La confirmación de la contraseña no coincide con la contraseña original."
			}));
			disabled = true;
		}

		if (disabled) {
			return register.setDisabled(true);	
		}
		
		setCurrentStep(STEPS.TWO);
		register.setCredentialsErrors({
			...register.credentialsErrors,
			email: null,
			password: null,
			confirmPassword: null
		});
	}

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				register.handleRegister();
			}}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Regístrate y comienza ya</h1>
				<div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
					¿Quieres suscribirte?{" "}
					<Link to="/registro/suscriptor" className="underline underline-offset-4 text-zinc-900 dark:text-white">
						Registrate Aqui
					</Link>
				</div>
			</div>
			{(currentStep === STEPS.ONE || register.credentialsErrors.email || register.credentialsErrors.password || register.credentialsErrors.confirmPassword) ? (
				<motion.div className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="email">Correo Electronico</Label>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="nombre@organizacion.tipo"
							onChange={e => {
								register.setCredential(e)
								register.setError(e)
							}}
							value={register.credentials.email}
							disabled={register.loading}
						/>
						{register.credentialsErrors.email && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.email}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Contraseña</Label>
						<Input
							id="password"
							type="password"
							autoComplete="new-password"
							onChange={e => {
								register.setCredential(e);
								register.setError(e);
							}}
							value={register.credentials.password}
							disabled={register.loading}
						/>
						{register.credentialsErrors.password && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.password}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Confirmar Contraseña</Label>
						<Input
							id="confirmPassword"
							type="password"
							autoComplete="new-password"
							onChange={e => {
								register.setCredential(e);
								register.setError(e);
							}}
							value={register.credentials.confirmPassword}
							disabled={register.loading}
						/>
						{register.credentialsErrors.confirmPassword && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.confirmPassword}
								</span>
							</p>
						)}
					</div>
					<Button
						type="button"
						className="w-full"
						disabled={register.loading || register.disabled}
						onClick={(e) => {
							e.preventDefault();
							nextStep();
						}}
					>
						Siguiente Paso
					</Button>
				</motion.div>
			) : (
				<motion.div className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="academicLevel">Nivel Academico</Label>
						<Select
							onValueChange={value => {
								register.setCredentials({
									...register.credentials,
									academicLevel: value
								});
								register.setCredentialsErrors({
									...register.credentialsErrors,
									academicLevel: null
								});
							}}
							value={register.credentials.academicLevel}
						>
							<SelectTrigger>
								<SelectValue
									placeholder="Selecciona un nivel academico"
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="primaria">Primaria</SelectItem>
								<SelectItem value="bachiller">Bachiller</SelectItem>
								<SelectItem value="tecnologico">Técnico / Tecnológico</SelectItem>
								<SelectItem value="pregrado">Pregrado / Universitario</SelectItem>
								<SelectItem value="especialización">Especialización</SelectItem>
								<SelectItem value="maestria">Maestría</SelectItem>
								<SelectItem value="doctorado">Doctorado</SelectItem>
								<SelectItem value="certificación profesional">Certificación Profesional</SelectItem>
								<SelectItem value="diplomado">Diplomado</SelectItem>
								<SelectItem value="otro">Otro</SelectItem>
							</SelectContent>
						</Select>
						{register.credentialsErrors.academicLevel && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.academicLevel}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="sex">Sexo</Label>
						<Select
							onValueChange={value => {
								register.setCredentials({
									...register.credentials,
									sex: value
								});
								register.setCredentialsErrors({
									...register.credentialsErrors,
									sex: null
								});
							}}
							value={register.credentials.sex}
						>
							<SelectTrigger>
								<SelectValue
									placeholder="Selecciona un sexo"
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="masculino">Masculino</SelectItem>
								<SelectItem value="femenino">Femenino</SelectItem>
							</SelectContent>
						</Select>
						{register.credentialsErrors.sex && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.sex}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="birthdate">Fecha de Nacimiento</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className="bg-transparent dark:bg-transparent font-normal"
								>
									{register.credentials.birthdate ? (
										dayjs(register.credentials.birthdate.toISOString()).format("LL")
									) : (
										<span>Selecciona una fecha</span>
									)}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<div className="flex items-center text-sm gap-2 px-4 py-2">
									<span>Año:</span>
									<Input
										className="w-20 text-center"
										value={yearInput}
										onChange={handleYearChange}
										maxLength={4}
									/>
								</div>
								<Calendar
									locale={es}
									mode="single"
									selected={register.credentials.birthdate}
									onSelect={(value) => {
										register.setCredentials({
											...register.credentials,
											birthdate: value
										});
										register.setCredentialsErrors({
											...register.credentialsErrors,
											birthdate: null
										});
									}}
									disabled={(date: Date) =>
										date > new Date() || date < new Date("1900-01-01")
									}
									month={month}
									onMonthChange={setMonth}
									required={true}
								/>
							</PopoverContent>
						</Popover>
						{register.credentialsErrors.birthdate && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.birthdate}
								</span>
							</p>
						)}
					</div>
					<Button 
						type="submit" 
						className="w-full" 
						disabled={register.loading || register.disabled}
					>
						Registrarse
						{register.loading && (
							<LoaderCircle className="animate-spin" />
						)}
					</Button>
				</motion.div>
			)}

			<div className="text-center text-sm">
				¿Ya tienes una cuenta?{" "}
				<Link to="/acceso" className="underline underline-offset-4">
					Inicia Sesión Aqui
				</Link>
			</div>
		</form>
	)
}
