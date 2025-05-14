import { RegisterForm } from "@/components/form/register-form";
import RegisterDraw from "@/components/draws/RegisterDraw";
import { Link } from "react-router-dom";
import HeadProvider from "@/providers/HeadProvider";

function Register() {
	return (
		<>
			<HeadProvider title="Registro" />
			<div className="grid min-h-svh lg:grid-cols-2">
				<div className="flex flex-col gap-4 p-6 md:p-10">
					<div className="flex justify-center gap-2 md:justify-start">
						<Link to="/" className="flex items-center gap-2 font-medium">
						<img src="/logo.png" className="w-8" />
							Courseed
						</Link>
					</div>
					<div className="flex flex-1 items-center justify-center">
						<div className="w-full max-w-sm">
							<RegisterForm />
						</div>
					</div>
				</div>
				<div className="relative hidden lg:block">
					<div className="absolute inset-0 h-full w-full object-cover overflow-hidden flex items-center">
						<RegisterDraw />
					</div>
				</div>
			</div>
		</>
	);
}

export default Register;