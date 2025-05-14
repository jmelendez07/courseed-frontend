import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/ui/hero";
import { Navbar } from "@/components/ui/navbar";
import HeadProvider from "@/providers/HeadProvider";
import React from "react";
import { useLocation } from "react-router-dom";
import Logos from "@/components/ui/logos";
import WorkShopsGallery from "@/components/workshops-gallery";
import DiplomasGallery from "@/components/diplomas-gallery";
import CoursesGallery from "@/components/courses-gallery";
import Pricing from "@/components/pricing";

function Landing() {
    const location = useLocation();
    React.useLayoutEffect(() => {
        if (location.hash === "#precios") {
            document.getElementById("precios")?.scrollIntoView({ behavior: "smooth" });
        } else {
            document.documentElement.scrollTo({ top:0, left:0, behavior: "smooth" });
        }
    }, [location.pathname, location.key]);

    return (
        <main className="relative">
            <HeadProvider title="Courseed" />
            <Navbar />
            <Hero />
            <CoursesGallery />
            <DiplomasGallery />
            <WorkShopsGallery />
            <Pricing />
            <Logos heading="Con la confianza de estas instituciones" />
            <Footer />
        </main>
    );
}

export default Landing;