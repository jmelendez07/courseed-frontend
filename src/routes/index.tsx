import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page404 from "@/pages/404";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Logout from "@/pages/auth/Logout";
import Courses from "@/pages/Courses";
import Course from "@/pages/Course";
import Profile from "@/pages/auth/Profile";
import DashboardAdmin from "@/pages/auth/admin/Dashboard";
import Users from "@/pages/auth/admin/Users";
import CoursesAdmin from "@/pages/auth/admin/Courses";
import ReviewsAdmin from "@/pages/auth/admin/Reviews";
import DashboardUser from "@/pages/auth/user/Dashboard";
import Reactions from "@/pages/auth/user/Reactions";
import ReviewsUser from "@/pages/auth/user/Reviews";
import ProtectedAuthRoute from "./ProtectedAuthRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProtectedUserRoute from "./ProtectedUserRoute";
import DashboardSubscriber from "@/pages/auth/subscriptor/Dashboard";
import CoursesSubscriber from "@/pages/auth/subscriptor/Courses";
import ProtectedSubscriberRoute from "./ProtectedSubscriberRoute";
import RegisterSubscribe from "@/pages/auth/RegisterSubscribe";
import Subscriptions from "@/pages/auth/subscriptor/Subscriptions";
import Prediction from "@/pages/prediction";
import SearchHistory from "@/pages/auth/user/SearchHistory";
import ProgramsViewed from "@/pages/auth/user/ProgramsViewed";
import ProfileInterestForm from "@/pages/ProfileInterestForm";
import CourseRecomendationAdmin from "@/pages/auth/admin/CourseRecomendation";
import CourseRecomendationSuscriptor from "@/pages/auth/subscriptor/CourseRecomendation";

function Routes() {

    const routesForNotAuthenticated = [
        {
            path: '',
            element: <Landing/>
        },
        {
            path: '/acceso',
            element: <Login/>
        },
        {
            path: '/registro/suscriptor',
            element: <RegisterSubscribe />
        },
        {
            path: '/registro',
            element: <Register/>
        },
        {
            path: '/educacion',
            element: <Courses />
        },
        {
            path: '/educacion/:id',
            element: <Course />
        },
        {
            path: '/404',
            element: <Page404 />
        },
        {
            path: '/prediccion',
            element: <Prediction />
        }
    ];

    const routesForAuthenticated = [
        {
            path: '/',
            element: <ProtectedAuthRoute />,
            children: [
                {
                    path: '/salir',
                    element: <Logout />
                },
                {
                    path: '/perfil',
                    element: <Profile />
                },
                {
                    path: '/formulario-perfil',
                    element: <ProfileInterestForm />
                }
            ]
        }
    ]

    const routesForAdmin = [
        {
            path: '/administrador',
            element: <ProtectedAdminRoute />,
            children: [
                {
                    path: '',
                    element: <DashboardAdmin />
                },
                {
                    path: 'usuarios',
                    element: <Users />
                },
                {
                    path: 'educacion',
                    element: <CoursesAdmin />
                },
                {
                    path: 'reseñas',
                    element: <ReviewsAdmin />
                },
                {
                    path: 'recomendaciones/programas',
                    element: <CourseRecomendationAdmin />
                }
            ]
        }
    ]

    const routesForUser = [
        {
            path: '/usuario',
            element: <ProtectedUserRoute />,
            children: [
                {
                    path: '',
                    element: <DashboardUser />
                },
                {
                    path: 'reacciones',
                    element: <Reactions />
                },
                {
                    path: 'reseñas',
                    element: <ReviewsUser />
                },
                {
                    path: 'historial-busqueda',
                    element: <SearchHistory />
                },
                {
                    path: 'programas-visualizados',
                    element: <ProgramsViewed />
                }
            ]
        }
    ]

    const routesForSubscriptor = [
        {
            path: '/suscriptor',
            element: <ProtectedSubscriberRoute />,
            children: [
                {
                    path: '',
                    element: <DashboardSubscriber />
                },
                {
                    path: 'programas',
                    element: <CoursesSubscriber />
                },
                {
                    path: 'suscripciones',
                    element: <Subscriptions />
                },
                {
                    path: 'recomendaciones/programas',
                    element: <CourseRecomendationSuscriptor />
                }
            ]
        }
    ]

    const router = createBrowserRouter([
        {
            path: '/',
            errorElement: <Page404/>,
            children: [
                ...routesForNotAuthenticated,
                ...routesForAuthenticated,
                ...routesForAdmin,
                ...routesForUser,
                ...routesForSubscriptor
            ]
        }
    ]);

    return <RouterProvider router={router}/>
}

export default Routes;