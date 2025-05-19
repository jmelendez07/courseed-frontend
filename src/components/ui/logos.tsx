import AutoScroll from "embla-carousel-auto-scroll";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import useInstitution from "@/hooks/useInstitution";
import FadeItem from "./fade-item";

interface LogosProps {
	heading: string;
	className?: string;
}

const Logos = ({
	heading,
}: LogosProps) => {

	const institutionHook = useInstitution({});

	return (
		<section className="py-12 flex items-center flex-col">
			<div className="w-full flex flex-col items-center text-center ">
				<FadeItem>
					<h1 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">
						{heading}
					</h1>
				</FadeItem>
			</div>
			<FadeItem>
				<div className="pt-10 md:pt-16 lg:pt-20">
					<div className="relative mx-auto flex items-center justify-center lg:max-w-5xl max-w-[100vw] overflow-hidden">
						<Carousel
							opts={{ loop: true }}
							plugins={[AutoScroll({ playOnInit: true })]}
							className=""
						>
							<CarouselContent className="ml-0">
								{institutionHook.institutions.map((institution) => (
									<CarouselItem
										key={institution.id}
										className="font-semibold flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-2/5"
									>
										<div className="flex items-center justify-center gap-x-2">
											<img 
												src={institution.image ?? ''} 
												alt={institution.name} 
												className="shrink-0 max-w-20 object-cover"
											/>
											<p>{institution.name}</p>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>
						<div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
						<div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
					</div>
				</div>
			</FadeItem>
		</section>
	);
};

export default Logos;
