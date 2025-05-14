import React from "react";
import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";
import InstitutionsWithCoursesCount from "@/interfaces/institutions-with-courses-count";
import axios, { AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { ColorContext } from "@/providers/ColorProvider";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";
import CoursesWithReviewsReactionsCount from "@/interfaces/courses-with-reviews-reactions-count";

const tailwindShades: number[] = [700, 600, 500, 400, 300, 200, 100];

function DashboardChartCourses() {
	const institutionsSize = 3;
	const coursesSize = 9;
	const [institutions, setInstitutions] = React.useState<InstitutionsWithCoursesCount[]>([]);
	const [courses, setCourses] = React.useState<CoursesWithReviewsReactionsCount[]>([]);
	const [loadingCourses, setLoadingCourses] = React.useState<boolean>(true);
	const [loadingInstitutions, setLoadingInstitutions] = React.useState<boolean>(true);

	React.useEffect(() => {
		setLoadingInstitutions(true);
		axios.get(APIS.INSTITUTIONS_COURSES_COUNT, {
			params: { page: 0, size: institutionsSize }
		})
			.then((response: AxiosResponse<InstitutionsWithCoursesCount[]>) => {
				setInstitutions(response.data);
			})
			.catch(() => {
				setInstitutions([]);
			})
			.finally(() => setLoadingInstitutions(false));
	}, []);

	React.useEffect(() => {
		setLoadingCourses(true);
		axios.get(APIS.COURSES_REVIEWS_REACTIONS_COUNT, {
			params: { page: 0, size: coursesSize }
		})
			.then((response: AxiosResponse<CoursesWithReviewsReactionsCount[]>) => {
				setCourses(response.data);
			})
			.catch(() => setCourses([]))
			.finally(() => setLoadingCourses(false));
	}, []);

	const colorHook = React.useContext(ColorContext);
	const fullConfig = resolveConfig(tailwindConfig);
	function getTailwindColor(color: string, shade: number = 600): string {
		const colors = fullConfig.theme?.colors as Record<string, any>;
		if (colors[color]) {
			return typeof colors[color] === "string" ? colors[color] : colors[color]?.[shade] || null;
		}
		return "oklch(0.588 0.158 241.966)";
	}

	return (
		<>
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Panel de Educación Continua</h1>
				<p className="text-muted-foreground">Administra tus programas – Crea, edita y organiza contenido fácilmente.</p>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<BarChart
					className="md:col-span-2"
					title={`Top ${coursesSize} Educaciones continuas con Mayor Interacción 📚`}
					description="Esta gráfica muestra el ranking de cursos según el número de likes y reseñas recibidos."
					chartData={courses.map((course) => ({
						label: course.title,
						bar1: course.totalReviews,
						bar2: course.totalReactions
					}))}
					labelBar1="Reseñas"
					labelBar2="Reacciones"
					loading={loadingCourses}
				/>
				<PieChart
					title={`Top ${institutionsSize} Instituciones con Mayor Oferta Académica 🎓`}
					description="Esta gráfica muestra las 5 instituciones con el mayor número de cursos disponibles."
					chartData={institutions.map((institution, index) => ({
						label: institution.name,
						value: institution.totalCourses,
						fill: getTailwindColor(colorHook ? colorHook.color : "sky", tailwindShades[index] || 100),
					}))}
					loading={loadingInstitutions}
				/>
			</div>
		</>

	);
}

export default DashboardChartCourses;