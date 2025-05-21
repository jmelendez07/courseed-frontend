import { ArrowUpRight, ChevronsUpDown, LayoutPanelLeft, LogIn, LogOut, Menu, Moon, Sun, UserPlus } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import useInstitution from "@/hooks/useInstitution";
import useFaculty from "@/hooks/useFaculty";
import InstitutionInterface from "@/interfaces/institution";
import CategoryInterface from "@/interfaces/category";
import { useAuth } from "@/providers/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import React from "react";
import ROLES from "@/enums/roles";
import { THEME, ThemeContext } from "@/providers/ThemeProvider";
import Color from "./Color";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import FadeItem from "./fade-item";
import AvatarProfile from "./avatar-profile";

interface MenuItem {
    title: string;
    url: string;
    paramKey?: string;
    items?: InstitutionInterface[] | CategoryInterface[];
    description?: string;
    icon?: JSX.Element;
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    auth?: {
        login: {
            text: string;
            url: string;
        };
        signup: {
            text: string;
            url: string;
        };
    };
}

let easeing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
    animate: {
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.2,
            staggerDirection: 1
        }
    }
}

const header = {
    initial: {
        y: -60,
        opacity: 0,
        transition: { duration: 0.05, ease: easeing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easeing
        }
    }
};

const Navbar = ({
    logo = {
        url: "/",
        src: "/logo.png",
        alt: "Courseed",
        title: "Courseed",
    },
    auth = {
        login: { text: "Acceder", url: "/acceso" },
        signup: { text: "Registrarse", url: "/registro" },
    },
}: NavbarProps) => {

    const institutionHook = useInstitution({ size: 20 });
    const facultyHook = useFaculty({ size: 30 });
    const authHook = useAuth();
    const themeContext = React.useContext(ThemeContext);
    const { scrollY } = useScroll();
    const [hidden, setHidden] = React.useState<boolean>(false);

    const menu: MenuItem[] = [
        { title: "Educacion continuada", url: "/educacion" },
        {
            title: "Instituciones",
            url: "/",
            paramKey: "institucion",
            items: institutionHook.institutions
        },
        {
            title: "Categorias",
            url: "/",
            paramKey: "facultad",
            items: facultyHook.faculties
        },
        {
            title: "Suscripciones",
            url: "/#precios",
            paramKey: "suscripciones",
        }
    ];

    const getPrincipalRoute = (): string => {
        if (authHook?.user?.roles?.some(r => r === ROLES.ADMIN)) {
            return "/administrador";
        } else if (authHook?.user?.roles?.some(r => r === ROLES.SUBSCRIBER)) {
            return "/suscriptor";
        } else {
            return "/usuario";
        }
    }

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        setHidden(latest > previous && latest > 150);
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="sticky top-0 z-50 py-4 flex justify-center border-b border-zinc-100 dark:border-zinc-600 bg-white dark:bg-zinc-950"
        >
            <motion.div 
                initial="initial" 
                animate="animate"
                className="w-full px-4 md:px-8 xl:px-12 2xl:px-16"
            >
                <FadeItem>
                    <nav className="hidden items-center justify-between lg:flex">
                        <motion.div variants={stagger} className="flex items-center gap-6">
                            <Link to={logo.url} className="flex items-center gap-2">
                                <motion.img 
                                    variants={header} 
                                    src={logo.src} 
                                    className="w-8" 
                                    alt={logo.alt} 
                                />
                                <motion.span variants={header} className="text-lg font-semibold">{logo.title}</motion.span>
                            </Link>
                            <div className="flex items-center">
                                <NavigationMenu>
                                    <NavigationMenuList>
                                        {menu.map((item) => renderMenuItem(item))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>
                        </motion.div>
                        <motion.div variants={stagger} className="flex items-center flex-row-reverse gap-4">
                            {authHook?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.div
                                            variants={header}
                                            className="flex items-center justify-start gap-3 p-2"
                                        >
                                            <AvatarProfile imageUrl={authHook.user.image} name={authHook.getName()} className="shadow-lg" />
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">{authHook.getName()}</span>
                                                <span className="truncate text-xs">{authHook?.user?.email}</span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto size-4" />
                                        </motion.div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                        side="bottom"
                                        align="end"
                                        sideOffset={4}
                                    >
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                <AvatarProfile imageUrl={authHook.user.image} name={authHook.getName()} />
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">{authHook.getName()}</span>
                                                    <span className="truncate text-xs">{authHook?.user?.email}</span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <Link to={getPrincipalRoute()}>
                                                <DropdownMenuItem>
                                                    <LayoutPanelLeft />
                                                    Panel
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/salir">
                                                <DropdownMenuItem>
                                                    <LogOut />
                                                    Cerrar Sesión
                                                </DropdownMenuItem>
                                            </Link>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex flex-row-reverse gap-2 py-2">
                                    <motion.div variants={header}>
                                        <Button asChild size="sm">
                                            <Link
                                                to={auth.signup.url}
                                            >
                                                {auth.signup.text}
                                                <UserPlus />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                    <motion.div variants={header}>
                                        <Button asChild variant="outline" size="sm">
                                            <Link
                                                to={auth.login.url}
                                            >
                                                {auth.login.text}
                                                <LogIn />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </div>
                            )}
                            <motion.div variants={header}>
                                {themeContext?.theme === THEME.LIGHT ? (
                                    <Moon
                                        className="cursor-pointer size-5"
                                        onClick={() => themeContext.handleChange(THEME.DARK)}
                                    />
                                ) : (
                                    <Sun
                                        className="cursor-pointer size-5"
                                        onClick={() => themeContext?.handleChange(THEME.LIGHT)}
                                    />
                                )}
                            </motion.div>
                            <motion.div variants={header}>
                                <Color />
                            </motion.div>
                        </motion.div>
                    </nav>
                    <div className="block lg:hidden">
                        <div className="flex items-center justify-between">
                            <motion.div variants={stagger}>
                                <Link to={logo.url} className="flex items-center gap-2">
                                    <motion.img variants={header} src={logo.src} className="w-8" alt={logo.alt} />
                                    <motion.span variants={header} className="text-lg font-semibold">{logo.title}</motion.span>
                                </Link>
                            </motion.div>
                            <motion.div variants={stagger} className="flex items-center flex-row-reverse gap-4">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <motion.div variants={header}>
                                            <Button variant="outline" size="icon">
                                                <Menu className="size-4" />
                                            </Button>
                                        </motion.div>
                                    </SheetTrigger>
                                    <SheetContent className="overflow-y-auto" side="left">
                                        <SheetHeader>
                                            <SheetTitle>
                                                <a href={logo.url} className="flex items-center gap-2">
                                                    <img src={logo.src} className="w-8" alt={logo.alt} />
                                                    <span className="text-lg font-semibold">
                                                        {logo.title}
                                                    </span>
                                                </a>
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="my-6 flex flex-col gap-6">
                                            <Accordion
                                                type="single"
                                                collapsible
                                                className="flex w-full flex-col gap-4"
                                            >
                                                {menu.map((item) => renderMobileMenuItem(item))}
                                            </Accordion>
                                            {authHook?.user ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div
                                                            className="flex items-center justify-start gap-3 p-2"
                                                        >
                                                            <AvatarProfile imageUrl={authHook.user.image} name={authHook.getName()} className="shadow-lg" />
                                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                                <span className="truncate font-semibold">{authHook.getName()}</span>
                                                                <span className="truncate text-xs">{authHook?.user?.email}</span>
                                                            </div>
                                                            <ChevronsUpDown className="ml-auto size-4" />
                                                        </div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                                        side="bottom"
                                                        align="end"
                                                        sideOffset={4}
                                                    >
                                                        <DropdownMenuLabel className="p-0 font-normal">
                                                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                                <AvatarProfile imageUrl={authHook.user.image} name={authHook.getName()} />
                                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                                    <span className="truncate font-semibold">{authHook.getName()}</span>
                                                                    <span className="truncate text-xs">{authHook?.user?.email}</span>
                                                                </div>
                                                            </div>
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuGroup>
                                                            <Link to={getPrincipalRoute()}>
                                                                <DropdownMenuItem>
                                                                    <LayoutPanelLeft />
                                                                    Panel
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link to="/salir">
                                                                <DropdownMenuItem>
                                                                    <LogOut />
                                                                    Cerrar Sesión
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        </DropdownMenuGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : (
                                                <div className="flex flex-col gap-3 border-t py-4">
                                                    <Button asChild variant="outline">
                                                        <Link to={auth.login.url}>
                                                            {auth.login.text}
                                                            <LogIn />
                                                        </Link>
                                                    </Button>
                                                    <Button asChild>
                                                        <Link to={auth.signup.url}>
                                                            {auth.signup.text}
                                                            <UserPlus />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <motion.div variants={header}>
                                    {themeContext?.theme === THEME.LIGHT ? (
                                        <Moon
                                            className="cursor-pointer size-5"
                                            onClick={() => themeContext.handleChange(THEME.DARK)}
                                        />
                                    ) : (
                                        <Sun
                                            className="cursor-pointer size-5"
                                            onClick={() => themeContext?.handleChange(THEME.LIGHT)}
                                        />
                                    )}
                                </motion.div>
                                <motion.div variants={header}><Color /></motion.div>
                            </motion.div>
                        </div>
                    </div>
                </FadeItem>
            </motion.div>
        </motion.nav>
    );
};

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title} className="text-muted-foreground">
                <motion.div variants={header}>
                    <NavigationMenuTrigger className="dark:bg-none">{item.title}</NavigationMenuTrigger>
                </motion.div>
                <NavigationMenuContent>
                    <div className="max-h-80 scroll-auto">
                        <ul className="w-80 h-full p-3">
                            <NavigationMenuLink>
                                {item.items.map((subItem, _) => (
                                    <li key={subItem.id}>
                                        <Link
                                            className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground group"
                                            to={`/educacion?${item.paramKey}=${subItem.id}`}
                                        >
                                            <ArrowUpRight className="w-5 min-w-5 transition-transform group-hover:translate-x-1" />
                                            <div>
                                                <p className="text-sm leading-snug text-muted-foreground">
                                                    {subItem.name}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </NavigationMenuLink>
                        </ul>
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <motion.div key={item.title} variants={header}>
            <Link
                className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground"
                to={item.url}
            >
                {item.title}
            </Link>
        </motion.div>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem, _) => (
                        <Link
                            key={subItem.id}
                            className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:text-accent-foreground group"
                            to={`/educacion?${item.paramKey}=${subItem.id}`}
                        >
                            <ArrowUpRight className="w-5 min-w-5 transition-transform group-hover:translate-x-1" />
                            <div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                    {subItem.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link key={item.title} to={item.url} className="font-semibold">
            {item.title}
        </Link>
    );
};

export { Navbar };