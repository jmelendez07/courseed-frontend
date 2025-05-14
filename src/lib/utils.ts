import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function splitString(str: string): string[] {
	const characters: string[] = [];
	const regex = /[\s\S]/gu;

	let match;

	while((match = regex.exec(str)) !== null) {
		characters.push(match[0]);
	}

	return characters;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export function validatePasswordLength(password: string): boolean {
    const length = password.trim().length;
	return length > 7 && length < 21;
};

export function standardizeCategory(categoryName: string): string {
    const category = categoryName.trim().toLowerCase();

    if (/.*(arquitectura y dis[e|e][n|ñ]o).*/.test(category)) {
        return "arquitectura";
    }

    if (/.*(artes|artes y humanidades|ciencias humanas|humanidades).*/.test(category)) {
        return "artes y humanidades";
    }

    if (/.*(centro interdisciplinario de estudios sobre desarrollo|ciencias sociales|ciencias sociales y humanidades).*/.test(category)) {
        return "ciencias sociales";
    }

    if (/.*(ciencias de la educacion|educacion).*/.test(category)) {
        return "ciencias de la educacion";
    }

    if (/.*(ciencias de la salud|enfermeria|medicina|odontologia|psicologia|quimica y farmacia).*/.test(category)) {
        return "ciencias de la salud";
    }

    if (/.*(ciencias|ciencias basicas).*/.test(category)) {
        return "ciencias";
    }

    if (/.*(ciencias juridicas|derecho|derecho canonico|escuela de negocios leyes y sociedad).*/.test(category)) {
        return "derecho";
    }

    if (/.*(ciencias politicas y relaciones internacionales|escuela de gobierno alberto lleras camargo|escuela de gobierno y etica publica).*/.test(category)) {
        return "ciencias politicas";
    }

    if (/.*(comunicacion y lenguaje).*/.test(category)) {
        return "comunicacion y lenguaje";
    }

    if (/.*(diseño e ingenieria|ingenieria).*/.test(category)) {
        return "ingenieria";
    }

    if (/.*(estudios ambientales y rurales|instituto ideeas|instituto pensar|vicerrectoria de investigacion y creacion).*/.test(category)) {
        return "ambiental";
    }

    if (/.*(filosof[i|í]a|teolog[i|í]a).*/.test(category)) {
        return "filosofia";
    }

    if (/.*(nutricion y dietetica).*/.test(category)) {
        return "nutricion y dietetica";
    }

    if (/.*(econom[i|í]a|empresariales|administrativas|negocios|finanzas).*/.test(category)) {
        return "ciencias economicas";
    }

    if (/.*(direccion de internacionalizacion).*/.test(category)) {
        return "direccion de internacionalizacion";
    }

    return "none";
}